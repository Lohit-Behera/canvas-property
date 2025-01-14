import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/userModel.js";
import { oAuth2Client } from "../utils/googleConfig.js";

// generate access token and refresh token
const generateTokens = async (userId, res) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json(new ApiResponse(404, null, "User not found"));
        return null;
      }
  
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
  
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
  
      return { accessToken, refreshToken };
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json(
          new ApiResponse(
            500,
            null,
            "Something went wrong while generating tokens"
          )
        );
      return null;
    }
  };

// login user
const login = asyncHandler(async (req, res) => {
    // get data from req.body
    const { email, password } = req.body;
  
    // validate data
    if (!email || !password) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Please provide all required fields."));
    }
  
    // check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Invalid credentials."));
    }
  
    // check password
    if (!(await user.comparePassword(password))) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Invalid credentials."));
    }
  
    // generate tokens
    const tokens = await generateTokens(user._id, res);
    const { accessToken, refreshToken } = tokens;
  
    const updatedUser = await User.findById(user._id).select(
      "-password -__v"
    );
  
    // send response
    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 24 * 60 * 60 * 1000,
      })
      .json(new ApiResponse(200, updatedUser, "Login successful."));
  });

// logout user
const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          refreshToken: null,
        },
      },
      {
        new: true,
      }
    );
    // send response
    return res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json(new ApiResponse(200, null, "Logout successful."));
  });
  
  const userDetails = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id).select(
      "-password -refreshToken -__v"
    );
    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, "User not found."));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User found successfully."));
  });

// google auth
const googleAuth = asyncHandler(async (req, res) => {
  try {
    const { token } = req.body;

    if (!token || typeof token !== "string") {
      return res
        .status(400)
        .json(
          new ApiResponse(400, {}, "Token is required and must be a string")
        );
    }

    const googleRes = await oAuth2Client.getToken(token);
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: googleRes.tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    const { email, name } = payload;

    if (!email || !name) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Email or name are not found"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      const user = await User.create({
        email,
        name,
        password: Math.random().toString(36).slice(-8),
      });
      // generate tokens
      const tokens = await generateTokens(user._id, res);
      if (!tokens) {
        return; // Exit if tokens generation failed
      }
      const { accessToken, refreshToken } = tokens;

      const loggedInUser = await User.findById(user._id).select(
        "-password -avatar -createdAt -updatedAt -__v"
      );

      // send response
      return res
        .status(200)
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 60 * 24 * 60 * 60 * 1000,
        })
        .json(
          new ApiResponse(200, loggedInUser, "Sign up successful with google")
        );
    } else {
      // generate tokens
      const tokens = await generateTokens(user._id, res);
      if (!tokens) {
        return; // Exit if tokens generation failed
      }
      const { accessToken, refreshToken } = tokens;
      const loggedInUser = await User.findById(user._id).select(
        "-password -avatar -createdAt -updatedAt -__v"
      );

      // send response
      return res
        .status(200)
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 60 * 24 * 60 * 60 * 1000,
        })
        .json(
          new ApiResponse(200, loggedInUser, "Sign in successful with google")
        );
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Something went wrong with google"));
  }
});

export { login, logout, userDetails, googleAuth };
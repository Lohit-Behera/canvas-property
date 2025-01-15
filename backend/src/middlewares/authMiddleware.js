import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/userModel.js";

// Helper function to check if the token has expired
function isTokenExpired(token) {
  try {
    const decoded = jwt.decode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (err) {
    return true;
  }
}

// Auth Middleware function
export const authMiddleware = asyncHandler(
  async (req, res, next) => {
    try {
      let token = req.cookies.accessToken || "";

      // Check if the access token is expired
      const isAccessTokenExpired = isTokenExpired(token);

      if (!req.cookies.accessToken || isAccessTokenExpired) {
        let refreshToken = req.cookies.refreshToken;

        // Check if refresh token is missing
        if (!refreshToken) {
          const userInfoCanvasProperty = JSON.parse(req.cookies.userInfoCanvasProperty);
          if (!userInfoCanvasProperty) {
            return res
              .status(401)
              .json(new ApiResponse(401, {}, "Invalid token"));
          }
          refreshToken = userInfoCanvasProperty.refreshToken;
        }

        // Check if the refresh token is expired
        const isRefreshTokenExpired = isTokenExpired(refreshToken);
        if (isRefreshTokenExpired) {
          return res
            .status(401)
            .json(new ApiResponse(401, {}, "Refresh token expired"));
        }

        // Verify the refresh token and retrieve the user
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        const user = await User.findById(decoded.id);

        // If user not found
        if (!user) {
          return res
            .status(401)
            .json(new ApiResponse(401, {}, "Invalid token"));
        }

        // Generate new access
        const newAccessToken = user.generateAccessToken();
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 10 * 60 * 1000, // 10 minutes
        });

        token = newAccessToken; // Update token to new access token
      }

      if (!token) {
        return res
          .status(401)
          .json(new ApiResponse(401, {}, "You are Unauthorized"));
      }

      // Verify the access token and retrieve the user
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      );
      const user = await User.findById(decoded.id);

      // If user not found
      if (!user) {
        return res
          .status(401)
          .json(new ApiResponse(401, {}, "Invalid token, user not found"));
      }

      req.user = user; // Attach user to the request object
      next();
    } catch (error) {
      console.log(error);
      return res
        .status(401)
        .json(
          new ApiResponse(
            401,
            error.message,
            "Invalid token in auth middleware"
          )
        );
    }
  }
);

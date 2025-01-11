import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../proxy";
import { getCookie } from "../getCookie";

export const fetchLogin = createAsyncThunk(
    "user/login",
    async (user, { rejectWithValue }) => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
        const { data } = await axios.post(`${baseUrl}/api/users/login`, user, config);
        document.cookie = `userInfoCanvasProperty=${encodeURIComponent(
          JSON.stringify(data.data)
        )}; path=/; max-age=${30 * 24 * 60 * 60}; secure; sameSite=None;`;
        return data;
      } catch (error) {
        const errorMessage =
          error.response && error.response.data
            ? error.response.data.message
            : error.message;
        return rejectWithValue(errorMessage);
      }
    }
  );

// logout
export const fetchLogout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/users/logout`,
        config
      );
      document.cookie =
        "userInfoCanvasProperty=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      return data;
    } catch (error) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : error.message;
      return rejectWithValue(errorMessage);
    }
  }
)

// user details
export const fetchUserDetails = createAsyncThunk(
  "user/userDetails",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/users/details`,
        config
      );
      return data;
    } catch (error) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : error.message;
      return rejectWithValue(errorMessage);
    }
  }
)
  
const userInfoCookie = getCookie("userInfoCanvasProperty");

const userSlice = createSlice({
name: "user",
initialState: {
    userInfo: userInfoCookie ? JSON.parse(userInfoCookie) : null,
    userInfoStatus: "idle",
    userInfoError: {},

    userDetails: { data: {} },
    userDetailsStatus: "idle",
    userDetailsError: {},
},
reducers: {
},
extraReducers: (builder) => {
    builder
    .addCase(fetchLogin.pending, (state) => {
        state.userInfoStatus = "loading";
    })
    .addCase(fetchLogin.fulfilled, (state, action) => {
        state.userInfoStatus = "succeeded";
        state.userInfo = action.payload.data;
    })
    .addCase(fetchLogin.rejected, (state, action) => {
        state.userInfoStatus = "failed";
        state.userInfoError = action.payload || "Login failed";
    })

    // user details
    .addCase(fetchUserDetails.pending, (state) => {
        state.userDetailsStatus = "loading";
    })
    .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.userDetailsStatus = "succeeded";
        state.userDetails = action.payload;
    })
    .addCase(fetchUserDetails.rejected, (state, action) => {
        state.userDetailsStatus = "failed";
        state.userDetailsError = action.payload || "Failed to get user details";
    })
},
});

export default userSlice.reducer;
  
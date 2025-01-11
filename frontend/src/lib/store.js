import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userSlice,
    },
  });
};
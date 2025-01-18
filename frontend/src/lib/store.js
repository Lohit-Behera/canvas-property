import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import propertySlice from "./features/propertySlice";
import categorySlice from "./features/categorySlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userSlice,
      property: propertySlice,
      category: categorySlice
    },
  });
};
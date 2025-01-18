import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../proxy";

export const fetchCreateCategory = createAsyncThunk(
    "category/createCategory",
    async (
        category,
        { rejectWithValue }
    ) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            };
            const { data } = await axios.post(
                `${baseUrl}/api/categories/create`,
                category,
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

export const fetchGetAllCategories = createAsyncThunk(
    "category/getAllCategories",
    async (_, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            };
            const { data } = await axios.get(
                `${baseUrl}/api/categories/all`,
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

const categorySlice = createSlice({
    name: "category",
    initialState: {
        createCategory: {},
        createCategoryStatus: "idle",
        createCategoryError: {},

        getAllCategories: { data: [] },
        getAllCategoriesStatus: "idle",
        getAllCategoriesError: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // create category
            .addCase(fetchCreateCategory.pending, (state) => {
                state.createCategoryStatus = "loading";
            })
            .addCase(fetchCreateCategory.fulfilled, (state, action) => {
                state.createCategoryStatus = "succeeded";
                state.createCategory = action.payload;
            })
            .addCase(fetchCreateCategory.rejected, (state, action) => {
                state.createCategoryStatus = "failed";
                state.createCategoryError = action.payload;
            })

            // get all categories
            .addCase(fetchGetAllCategories.pending, (state) => {
                state.getAllCategoriesStatus = "loading";
            })
            .addCase(fetchGetAllCategories.fulfilled, (state, action) => {
                state.getAllCategoriesStatus = "succeeded";
                state.getAllCategories = action.payload;
            })
            .addCase(fetchGetAllCategories.rejected, (state, action) => {
                state.getAllCategoriesStatus = "failed";
                state.getAllCategoriesError = action.payload;
            });
    },
});

export default categorySlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../proxy";

export const fetchCreateProperty = createAsyncThunk(
    "property/createProperty",
    async (
        property,
        { rejectWithValue }
    ) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            };
            const { data } = await axios.post(
                `${baseUrl}/api/properties/create`,
                property,
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
);

export const fetchGetAllProperties = createAsyncThunk(
    "property/getAllProperties",
    async (_, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
            const { data } = await axios.get(`${baseUrl}/api/properties/all`, config);
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

const propertySlice = createSlice({
    name: "property",
    initialState: {
       createProperty: {},
       createPropertyStatus: "idle",
       createPropertyError: {},

       getAllProperties: { data: [] },
       getAllPropertiesStatus: "idle",
       getAllPropertiesError: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        // Create Property
        .addCase(fetchCreateProperty.pending, (state) => {
            state.createPropertyStatus = "loading";
        })
        .addCase(fetchCreateProperty.fulfilled, (state, action) => {
            state.createPropertyStatus = "succeeded";
            state.createProperty = action.payload;
        })
        .addCase(fetchCreateProperty.rejected, (state, action) => {
            state.createPropertyStatus = "failed";
            state.createPropertyError = action.payload || "Failed to create property";
        })

        // Get All Properties
        .addCase(fetchGetAllProperties.pending, (state) => {
            state.getAllPropertiesStatus = "loading";
        })
        .addCase(fetchGetAllProperties.fulfilled, (state, action) => {
            state.getAllPropertiesStatus = "succeeded";
            state.getAllProperties = action.payload;
        })
        .addCase(fetchGetAllProperties.rejected, (state, action) => {
            state.getAllPropertiesStatus = "failed";
            state.getAllPropertiesError = action.payload || "Failed to get properties";
        });
    },
});

export default propertySlice.reducer;
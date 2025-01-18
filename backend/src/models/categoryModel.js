import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        subCategory: {
            type: [String],
        },
    },
);

export const Category = mongoose.model("Category", categorySchema);
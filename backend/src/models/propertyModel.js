import mongoose, { Schema } from "mongoose";

const propertySchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        subCategory: {
            type: String,
        },
        address: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: [String],
            required: true,
        },
        bigImage: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Property = mongoose.model("Property", propertySchema);
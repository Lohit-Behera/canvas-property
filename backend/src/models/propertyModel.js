import mongoose, { Schema } from "mongoose";

const propertySchema = new Schema(
    {
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
        propertyType: {
            type: String,
            required: true,
            enum: ["Residential", "Commercial", "Industrial", "Land"],
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
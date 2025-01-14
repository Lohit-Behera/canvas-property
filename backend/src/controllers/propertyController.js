import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Property } from "../models/propertyModel.js";   
import Joi from "joi";
import { uploadFile } from "../utils/cloudinary.js";

const createProperty = asyncHandler(async (req, res) => {
    // joi schema for validation
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        size: Joi.string().required(),
        propertyType: Joi.string().valid("Residential", "Commercial", "Industrial", "Land").required(),
        address: Joi.string().required(),
        postalCode: Joi.string()
      });

    // Validate request body
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, error.details[0].message));
    }

    const { title, description, price, size, propertyType, address, postalCode } = value;

    // get images from req.files
    const thumbnail = req.files.thumbnail[0];
    const bigImage = req.files.bigImage[0];

    // validate images
    if (!thumbnail || !bigImage) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Thumbnail and big image are required"));
    }

    // upload images to cloudinary
    const thumbnailUrl = await uploadFile(thumbnail);
    const bigImageUrl = await uploadFile(bigImage);

    // validate uploaded images
    if (!thumbnailUrl || !bigImageUrl) {
      return res
        .status(500)
        .json(new ApiResponse(500, null, "Image upload failed"));
    }

    // create property
    const property = await Property.create({
      title,
      description,
      price,
      size,
      propertyType,
      address,
      postalCode,
      thumbnail: thumbnailUrl,
      bigImage: bigImageUrl,
    });

    // validate property
    const createdProperty = await Property.findById(property._id);
    if (!createdProperty) {
      return res
        .status(500)
        .json(new ApiResponse(500, null, "Property not created"));
    }
    return res
      .status(201)
      .json(new ApiResponse(201, createdProperty, "Property created successfully"));
})

const getAllProperties = asyncHandler(async (req, res) => {
    const properties = await Property.find().sort({ createdAt: -1 });
    if (!properties) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Properties not found"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, properties, "Properties fetched successfully"));
})

export { createProperty, getAllProperties }
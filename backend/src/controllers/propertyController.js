import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Property } from "../models/propertyModel.js";   
import Joi from "joi";
import { uploadFile } from "../utils/cloudinary.js";
import { User } from "../models/userModel.js";

const createProperty = asyncHandler(async (req, res) => {
  // get user from req.user
  const user = User.findById(req.user._id);
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  // joi schema for validation
  const schema = Joi.object({
      title: Joi.string().min(3).max(50).required(),
      description: Joi.string().required(),
      price: Joi.number().required(),
      size: Joi.string().required(),
      category: Joi.string().required(),
      subCategory: Joi.string().optional(),
      address: Joi.string().required(),
      city: Joi.string().required(),
      postalCode: Joi.string()
    });

  // Validate request body
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, error.details[0].message));
  }

  const { title, description, price, size, category, subCategory, address, city, postalCode } = value;

  // get images from req.files
  const thumbnails = req.files.thumbnail;
  const bigImage = req.files.bigImage[0];

  // validate images
  if (!thumbnails || thumbnails.length === 0 || !bigImage) {
    return res.status(400).json(new ApiResponse(400, null, "Thumbnails and big image are required"));
  }

  // upload images to cloudinary
  const thumbnailUrls = await Promise.all(thumbnails.map(file => uploadFile(file)));
  const bigImageUrl = await uploadFile(bigImage);

  // validate uploaded images
  if (!thumbnailUrls.every(url => url) || !bigImageUrl) {
    return res.status(500).json(new ApiResponse(500, null, "Image upload failed"));
  }

  // create property
  const property = await Property.create({
    user: user._id,
    title,
    description,
    price,
    size,
    category,
    subCategory,
    address,
    city,
    postalCode,
    thumbnail: thumbnailUrls,
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
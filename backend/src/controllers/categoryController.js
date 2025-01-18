import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/categoryModel.js";
import { User } from "../models/userModel.js";
import Joi from "joi";

// create category
const createCategory = asyncHandler(async (req, res) => {
    const user = User.findById(req.user._id);
    if (!user) {
        return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }
    // joi schema for validation
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        subCategory: Joi.array().optional(),
    });

    // Validate request body
    const { error, value } = schema.validate(req.body);
    if (error) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, error.details[0].message));
    }

    const { name, subCategory } = value;

    // check if category already exists
    const category = await Category.findOne({ name });

    if (category) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Category already exists"));
    }

    // create category
    const newCategory = await Category.create({
        name,
        subCategory,
    });

    const createdCategory = await Category.findById(newCategory._id);
    if (!createdCategory) {
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Category not created"));
    }

    return res
        .status(201)
        .json(new ApiResponse(201, newCategory, "Category created successfully"));
});


// get all categories
const getAllCategories = asyncHandler(async (req, res) => {
    // get all categories
    const categories = await Category.find().select("-__v");
    // validate the categories
    if (!categories) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Categories not found"));
    }
    // send the response
    return res
        .status(200)
        .json(new ApiResponse(200, categories, "Categories found successfully"));
});

// update category
const updateCategory = asyncHandler(async (req, res) => {
    // get category id from the params
    const { categoryId } = req.params;
    // get category
    const category = await Category.findById(categoryId);
    // validate the category
    if (!category) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Category not found"));
    }
    // joi schema for validation
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).optional(),
        subCategory: Joi.array().optional(),
    });
    // Validate request body
    const { error, value } = schema.validate(req.body);
    if (error) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, error.details[0].message));
    }
    // get name and subCategory from the request
    const { name, subCategory } = value;
    // if name or subCategory is provided, update the category
    if (name){
        category.name = name;
    }
    if (subCategory){
        category.subCategory = subCategory;
    }
    // save the category
    await category.save({validateBeforeSave: false});
    // send the response
    return res
        .status(200)
        .json(new ApiResponse(200, category, "Category updated successfully"));
})

export { createCategory, getAllCategories, updateCategory }
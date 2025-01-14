import { Router } from "express";
import { createProperty, getAllProperties } from "../controllers/propertyController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import { resizeImage } from "../middlewares/resizeMiddleware.js";

const propertyRouter = Router();

propertyRouter.post("/create", authMiddleware, upload.fields([{ name: "thumbnail" }, { name: "bigImage" }]), resizeImage, createProperty);
propertyRouter.get("/all", authMiddleware, getAllProperties);

export default propertyRouter;
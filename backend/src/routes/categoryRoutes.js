import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { createCategory, getAllCategories, updateCategory } from "../controllers/categoryController.js";

const categoryRouter = Router();

categoryRouter.post("/create", authMiddleware, adminMiddleware, createCategory);
categoryRouter.get("/all", authMiddleware, getAllCategories);
categoryRouter.put("/update/:categoryId", authMiddleware, adminMiddleware, updateCategory);

export default categoryRouter;
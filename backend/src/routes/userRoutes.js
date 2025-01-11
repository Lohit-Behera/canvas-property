import { Router } from "express";
import { login, logout, userDetails } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const userRouter = Router();

userRouter.post("/login", login);
userRouter.get("/logout", authMiddleware, logout);
userRouter.get("/userDetails", authMiddleware, userDetails);

export default userRouter;
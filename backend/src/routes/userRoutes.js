import { Router } from "express";
import { login, logout, userDetails, googleAuth, facebookAuth } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const userRouter = Router();

userRouter.post("/login", login);
userRouter.post("/auth/google", googleAuth);
userRouter.post("/auth/facebook", facebookAuth);
userRouter.get("/logout", authMiddleware, logout);
userRouter.get("/details", authMiddleware, userDetails);

export default userRouter;
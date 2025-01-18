import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// import routes  
import userRouter from "./routes/userRoutes.js";
import propertyRouter from "./routes/propertyRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";

app.use("/api/users", userRouter);
app.use("/api/properties", propertyRouter);
app.use("/api/categories", categoryRouter);

export { app };

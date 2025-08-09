import morgan from "morgan";
import fs from "fs";
import path from "path";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import groupRoutes from "./routes/groupRoutes";
import taskRoutes from "./routes/taskRoutes";
import authRoutes from "./routes/authRoutes";

import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

if (process.env.NODE_ENV === "production") app.use(limiter);

app.use(helmet());
app.use(hpp());

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// const accessLogStream = fs.createWriteStream(path.join(__dirname, "..", "logs", "access.log"), { flags: "a" });
app.use(morgan("combined"));


app.use("/api/groups", groupRoutes);
app.use("/api/groups/:groupId/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

app.use(express.static(path.join(__dirname, "public")));
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


export default app;

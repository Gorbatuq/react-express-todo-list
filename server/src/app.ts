import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";

import { env } from "./config/env";
import { requestId } from "./middleware/requestId";
import { errorHandler } from "./middleware/errorHandler";
import { csrfGuard } from "./middleware/csrfGuard";

import groupRoutes from "./routes/groupRoutes";
import taskRoutes from "./routes/taskRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();
app.set("trust proxy", 1);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

if (env.NODE_ENV === "production") app.use(globalLimiter);

app.use(requestId);
app.use(helmet());
app.use(hpp());

app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("combined"));

app.use(csrfGuard);

app.use("/api/groups", groupRoutes);
app.use("/api/groups/:groupId/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

if (env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "public")));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
}

app.use(errorHandler);

export default app;

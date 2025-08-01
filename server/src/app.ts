import morgan from 'morgan';
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import groupRoutes from "./routes/groupRoutes";
import taskRoutes from "./routes/taskRoutes";

import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();


app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));


app.use("/api/groups", groupRoutes); 
app.use("/api/groups/:groupId/tasks", taskRoutes); 
 

app.use("/api/auth", authRoutes); 



app.use(errorHandler);

export default app;

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { errorHandler } from "./middleware/errorHandler";
import taskGroupRoutes from "./routes/taskGroupRoutes";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json()); 
app.use("/api/task-groups", taskGroupRoutes);
app.use("/api/task-groups", taskRoutes);


app.get("/", (_req, res) => {
  res.send("Server work!");
});

app.listen(PORT, () => {
  console.log(`Server work in: ${PORT}`);
});

app.use(errorHandler);
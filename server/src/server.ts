import dotenv from "dotenv";
dotenv.config();

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required");
if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required");
if (!process.env.FRONTEND_ORIGIN) throw new Error("FRONTEND_ORIGIN is required");

import mongoose from "mongoose";
import app from "./app";
import { deleteOldGuests } from "./jobs/deleteOldGuests"; 

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    deleteOldGuests();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

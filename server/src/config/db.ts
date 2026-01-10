import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB() {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.MONGO_URI, {
    autoIndex: env.NODE_ENV !== "production",
    maxPoolSize: 20,
  });

  console.log("MongoDB connected");
}

import mongoose from "mongoose";
import { User } from "../models/User";
import fs from "fs";
import path from "path";

const logFilePath = path.join(__dirname, "..", "logs", "cleanup-guests.log");

// Log-fun
function log(message: string) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFilePath, `[${timestamp}] ${message}\n`);
}

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/";

async function cleanupGuests() {
  try {
    await mongoose.connect(MONGO_URI);
    log("🔌 Connected to MongoDB");

    const result = await User.deleteMany({
      role: "GUEST",
      lastLogin: { $lt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000) },
    });

    log(`🧹 Deleted ${result.deletedCount} old guest users`);

    await mongoose.disconnect();
    log("🔌 Disconnected from MongoDB");
  } catch (err: any) {
    log(`🔥 Error: ${err.message}`);
    process.exit(1);
  }
}

cleanupGuests();

import mongoose, { Document, Schema } from "mongoose";

export interface UserDocument extends Document {
  _id: string;
  email: string;
  password: string;
  taskCount?: number;
  role: "USER" | "GUEST";
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date; 
}

const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    taskCount: { type: Number, default: 0 },
    role: { type: String, enum: ["USER", "GUEST"], default: "USER" },
    lastLogin: { type: Date, default: Date.now }
  },
  { timestamps: true }
);


export const User = mongoose.model<UserDocument>("User", UserSchema);

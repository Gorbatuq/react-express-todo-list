import mongoose, { Schema, Document, Types } from "mongoose";


export interface TaskGroupDocument extends Document {
  title: string;
  order: number;
  userId: Types.ObjectId;
}

const TaskGroupSchema = new Schema<TaskGroupDocument>({
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export const TaskGroup = mongoose.model<TaskGroupDocument>("TaskGroup", TaskGroupSchema);


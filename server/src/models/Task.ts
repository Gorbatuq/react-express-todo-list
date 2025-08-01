import mongoose, { Schema, Document, Types } from "mongoose";

export interface Task extends Document {
  title: string;
  completed: boolean;
  order: number;
  groupId: Types.ObjectId;
  userId: Types.ObjectId;
}

const TaskSchema = new Schema<Task>({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  groupId: { type: Schema.Types.ObjectId, ref: "TaskGroup", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const Task = mongoose.model<Task>("Task", TaskSchema);

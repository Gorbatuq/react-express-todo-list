import mongoose, { Schema, Document, Types } from "mongoose";

export interface Task {
  _id?: Types.ObjectId;
  title: string;
  completed: boolean;
  order: number;
}

export interface TaskGroupDocument extends Document {
  title: string;
  order: number;
  tasks: Task[];
}

const TaskSchema = new Schema<Task>({
  title: { type: String, required: true },
  order: { type: Number, default: 0},
  completed: { type: Boolean, default: false },
});

const TaskGroupSchema = new Schema<TaskGroupDocument>({
  title: { type: String, required: true },
  order: { type: Number, default: 0 }, 
  tasks: [TaskSchema],
}, { timestamps: true });

export const TaskGroup = mongoose.model<TaskGroupDocument>("TaskGroup", TaskGroupSchema);

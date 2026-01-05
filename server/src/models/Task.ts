import { Schema, model, Types, type HydratedDocument } from "mongoose";

export interface Task {
  title: string;
  completed: boolean;
  order: number;
  groupId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskDocument = HydratedDocument<Task>;

const TaskSchema = new Schema<Task>(
  {
    title: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "TaskGroup",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate orders under concurrency
TaskSchema.index({ userId: 1, groupId: 1, order: 1 }, { unique: true });

export const Task = model<Task>("Task", TaskSchema);

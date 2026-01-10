import { Schema, model, Types, type HydratedDocument } from "mongoose";

export interface TaskGroup {
  title: string;
  order: number;
  userId: Types.ObjectId;
  priority: 1 | 2 | 3 | 4;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskGroupDocument = HydratedDocument<TaskGroup>;

const TaskGroupSchema = new Schema<TaskGroup>(
  {
    title: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    priority: { type: Number, enum: [1, 2, 3, 4], required: true, default: 2 },
  },
  { timestamps: true }
);

// Prevent duplicate orders under concurrency
TaskGroupSchema.index({ userId: 1, order: 1 }, { unique: true });

export const TaskGroup = model<TaskGroup>("TaskGroup", TaskGroupSchema);

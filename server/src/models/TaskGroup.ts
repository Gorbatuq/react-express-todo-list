import mongoose, { Schema, Document, Types } from "mongoose";


export interface TaskGroupDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  order: number;
  userId: Types.ObjectId;
  priority: 1 | 2 | 3 | 4;
}

const TaskGroupSchema = new Schema<TaskGroupDocument>(
  {
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    priority: { type: Number, enum: [1, 2, 3, 4], required: true, default: 2 },
  },
  { timestamps: true }
);


export const TaskGroup = mongoose.model<TaskGroupDocument>("TaskGroup", TaskGroupSchema);


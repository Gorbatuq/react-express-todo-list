import { TaskGroup } from "../models/TaskGroup";
import mongoose from "mongoose";

// Custom error with HTTP status
class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const groupService = {
  async getAllGroups(userId: string) {
    return TaskGroup.find({ userId }).sort({ order: 1 }).lean();
  },

  async createGroup(title: string, userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const count = await TaskGroup.countDocuments({ userId }).session(session);
      const group = new TaskGroup({ title, order: count, userId });
      await group.save({ session });

      await session.commitTransaction();
      session.endSession();
      return group;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw new AppError("Failed to create group", 500);
    }
  },

  async deleteGroup(groupId: string, userId: string) {
    const deleted = await TaskGroup.findOneAndDelete({ _id: groupId, userId });
    if (!deleted) throw new AppError("Group not found", 404);

    // Оновлюємо порядок решти груп
    const groups = await TaskGroup.find({ userId }).sort({ order: 1 });
    await Promise.all(
      groups.map((group, index) =>
        TaskGroup.updateOne({ _id: group._id }, { order: index })
      )
    );

    return { message: "Group deleted and reordered" };
  },

  async updateGroupTitle(id: string, title: string, userId: string) {
    const group = await TaskGroup.findOneAndUpdate(
      { _id: id, userId },
      { title },
      { new: true }
    );
    if (!group) throw new AppError("Group not found", 404);
    return group;
  },

  async reorderGroups(order: string[], userId: string) {
    const userGroups = await TaskGroup.find({ userId });
    const userGroupIds = userGroups.map((g) => g.id.toString());

    const isValid = order.every((id) => userGroupIds.includes(id));
    if (!isValid) throw new AppError("You can only reorder your own groups", 403);

    await Promise.all(
      order.map((id, index) =>
        TaskGroup.findOneAndUpdate({ _id: id, userId }, { order: index })
      )
    );

    return TaskGroup.find({ userId }).sort({ order: 1 }).lean();
  },
};

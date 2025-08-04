import { TaskGroup } from "../models/TaskGroup";
import { User } from "../models/User";
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

  async createGroup(title: string, priority: number, userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.findById(userId).lean();
      if (!user) throw new AppError("User not found", 404);

      const count = await TaskGroup.countDocuments({ userId }).session(session);

      if (user.role === "GUEST" && count >= 3) {
        throw new AppError("Guest can create no more than 3 groups", 403);
      }

      const group = new TaskGroup({ title, order: count, priority, userId });
      await group.save({ session });

      await session.commitTransaction();
      return group;
    } catch (err) {
      await session.abortTransaction();
      throw err instanceof AppError ? err : new AppError("Failed to create group", 500);
    } finally {
      session.endSession();
    }
  },

  async deleteGroup(groupId: string, userId: string) {
    const deleted = await TaskGroup.findOneAndDelete({ _id: groupId, userId });
    if (!deleted) throw new AppError("Group not found", 404);

    const groups = await TaskGroup.find({ userId }).sort({ order: 1 });
    await Promise.all(
      groups.map((group, index) =>
        TaskGroup.updateOne({ _id: group._id }, { order: index })
      )
    );

    return { message: "Group deleted and reordered" };
  },

  async updateGroup(
    groupId: string,
    userId: string,
    updates: Partial<{ title: string; priority: 1 | 2 | 3 | 4 }>
  ) {
    const group = await TaskGroup.findOneAndUpdate(
      { _id: groupId, userId },
      updates,
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

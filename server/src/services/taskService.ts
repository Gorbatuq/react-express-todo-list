import { Task } from "../models/Task";
import { Types } from "mongoose";
import createHttpError from "http-errors";
import { User } from "../models/User";

class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const taskService = {
  async getTasksByGroupId(groupId: string, userId: string) {
    return Task.find({ groupId, userId }).sort({ order: 1 }).lean();
  },

  async createTask(title: string, groupId: string, userId: string) {
  if (!Types.ObjectId.isValid(groupId)) {
    throw new AppError("Invalid groupId", 400);
  }

  const user = await User.findById(userId).lean();
  if (!user) throw new AppError("User not found", 404);

  const count = await Task.countDocuments({ groupId, userId });

  // if (user.role === "GUEST" && count >= 20) {
  //   throw new AppError("Guest can create no more than 20 tasks", 403);
  // }

  const task = new Task({
    title: title.trim(),
    completed: false,
    order: count,
    groupId,
    userId,
  });

  await task.save();
  return task;
},


  async deleteTask(taskId: string, userId: string) {
    const task = await Task.findOneAndDelete({ _id: taskId, userId });
    if (!task) throw new AppError("Task not found", 404);

    await Task.updateMany(
      { groupId: task.groupId, userId, order: { $gt: task.order } },
      { $inc: { order: -1 } }
    );

    return { message: "Task deleted" };
  },

  async reorderTasks(order: string[], groupId: string, userId: string) {
    const tasks = await Task.find({ groupId, userId });
    const taskIds = new Set(order);

    const validTasks = tasks.filter((t) => taskIds.has(String(t._id)));

    await Promise.all(
      validTasks.map((task, index) =>
        Task.updateOne({ _id: task._id }, { order: index })
      )
    );

    return { message: "Tasks reordered" };
  },

  async updateTask({
    taskId,
    groupId,
    userId,
    updates,
  }: {
    taskId: string;
    groupId: string;
    userId: string;
    updates: Partial<{
      title: string;
      completed: boolean;
      groupId: string;
      toIndex?: number;
    }>;
  }) {
    const task = await Task.findOne({ _id: taskId, groupId, userId });
    if (!task) throw new AppError("Task not found", 404);

     const fromGroupId = String(task.groupId);
  const fromOrder = task.order;

  // validate
  const toGroupId = updates.groupId ?? fromGroupId;
  if (!Types.ObjectId.isValid(toGroupId)) throw new AppError("Invalid target groupId", 400);

  const toIndexRaw = updates.toIndex;
  const isMove = updates.groupId !== undefined || updates.toIndex !== undefined;

  if (updates.title !== undefined) task.title = updates.title.trim();
  if (updates.completed !== undefined) task.completed = updates.completed;

  if (isMove) {
    // clamp target index
    const targetCount = await Task.countDocuments({ groupId: toGroupId, userId });
    // якщо переміщуєш в ту ж групу, count включає саму задачу — тому maxIndex = targetCount - 1
    const maxIndex = toGroupId === fromGroupId ? targetCount - 1 : targetCount;
    const toIndex = Math.max(0, Math.min(typeof toIndexRaw === "number" ? toIndexRaw : maxIndex, maxIndex));

    if (toGroupId !== fromGroupId) {
      // 1) закрити "дірку" у старій групі
      await Task.updateMany(
        { groupId: fromGroupId, userId, order: { $gt: fromOrder } },
        { $inc: { order: -1 } }
      );

      // 2) звільнити місце у новій групі
      await Task.updateMany(
        { groupId: toGroupId, userId, order: { $gte: toIndex } },
        { $inc: { order: 1 } }
      );

      task.groupId = new Types.ObjectId(toGroupId);
      task.order = toIndex;
      await task.save();

      return task;
    } else {
      // reorder в межах однієї групи
      if (toIndex === fromOrder) {
        await task.save();
        return task;
      }

      if (toIndex > fromOrder) {
        // рух вниз: [fromOrder+1 .. toIndex] зсунути вгору (-1)
        await Task.updateMany(
          { groupId: fromGroupId, userId, order: { $gt: fromOrder, $lte: toIndex } },
          { $inc: { order: -1 } }
        );
      } else {
        // рух вгору: [toIndex .. fromOrder-1] зсунути вниз (+1)
        await Task.updateMany(
          { groupId: fromGroupId, userId, order: { $gte: toIndex, $lt: fromOrder } },
          { $inc: { order: 1 } }
        );
      }

      task.order = toIndex;
      await task.save();
      return task;
    }
  }

  await task.save();
  return task;
},

  async importTasks(
    taskArray: Array<{
      title: string;
      groupId: string;
      order: number;
      completed?: boolean;
    }>,
    userId: string
  ) {
    const prepared = taskArray.map((t) => ({
      ...t,
      userId,
      completed: t.completed ?? false,
    }));

    await Task.insertMany(prepared);
    return { message: "Tasks imported" };
  },
};

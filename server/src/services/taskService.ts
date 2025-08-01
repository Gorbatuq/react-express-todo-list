import { Task } from "../models/Task";
import { Types } from "mongoose";
import createHttpError from "http-errors";

export const taskService = {
  async getTasksByGroupId(groupId: string, userId: string) {
    return Task.find({ groupId, userId }).sort({ order: 1 }).lean();
  },

  async createTask(title: string, groupId: string, userId: string) {
    const count = await Task.countDocuments({ groupId, userId });

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
    if (!task) throw createHttpError(404, "Task not found");

    // Перешикування порядку задач
    await Task.updateMany(
      { groupId: task.groupId, userId, order: { $gt: task.order } },
      { $inc: { order: -1 } }
    );

    return { message: "Task deleted" };
  },

  async reorderTasks(order: string[], groupId: string, userId: string) {
    const tasks = await Task.find({ groupId, userId });
    const idSet = new Set(order);

    const filtered = tasks.filter((t) => idSet.has(String(t._id)));

    await Promise.all(
      filtered.map((task, index) =>
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
    }>;
  }) {
    const task = await Task.findOne({ _id: taskId, groupId, userId });
    if (!task) throw createHttpError(404, "Task not found");

    let moved = false;
    const prevOrder = task.order;

    if (updates.title !== undefined) task.title = updates.title.trim();
    if (updates.completed !== undefined) task.completed = updates.completed;
    if (updates.groupId !== undefined && updates.groupId !== String(task.groupId)) {
      moved = true;
      const newOrder = await Task.countDocuments({
        groupId: updates.groupId,
        userId,
      });
      task.groupId = new Types.ObjectId(updates.groupId);
      task.order = newOrder;
    }
    
    await task.save();
    if (moved) {
      await Task.updateMany(
        {
          groupId: groupId,
          userId,
          order: { $gt: prevOrder },
        },
        { $inc: { order: -1 } }
      );
    }

    return task;
  },
};

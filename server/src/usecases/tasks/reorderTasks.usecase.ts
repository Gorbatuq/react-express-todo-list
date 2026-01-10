import mongoose from "mongoose";
import { AppError } from "../../errors/AppError";
import { taskRepo } from "../../repositories/taskRepo";

export async function reorderTasksUsecase(
  userId: string,
  groupId: string,
  body: { order: string[] }
) {
  const { order } = body;

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const tasks = await taskRepo.listByGroup(userId, groupId, session);
      if (tasks.length === 0)
        throw new AppError(404, "TASKS_NOT_FOUND", "No tasks in this group");

      if (order.length !== tasks.length)
        throw new AppError(
          400,
          "ORDER_LENGTH_MISMATCH",
          "Order must include all tasks"
        );

      if (new Set(order).size !== order.length)
        throw new AppError(400, "DUPLICATE_IDS", "Order has duplicate ids");

      const ids = new Set(tasks.map((t) => String(t._id)));
      if (!order.every((id) => ids.has(id)))
        throw new AppError(
          403,
          "FOREIGN_TASK",
          "Order contains foreign task ids"
        );

      await taskRepo.bulkSetOrder(userId, groupId, order, session);
    });

    return { message: "Tasks reordered" };
  } finally {
    session.endSession();
  }
}

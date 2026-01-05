import mongoose from "mongoose";
import { AppError } from "../../errors/AppError";
import { taskRepo } from "../../repositories/taskRepo";
import { ensureObjectId } from "../../utils/objectId";

export async function deleteTaskUsecase(userId: string, taskId: string) {
  ensureObjectId(userId, "userId");
  ensureObjectId(taskId, "taskId");

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const deleted = await taskRepo.deleteByIdForUser(taskId, userId, session);
      if (!deleted) throw new AppError(404, "TASK_NOT_FOUND", "Task not found");

      await taskRepo.shiftOrdersDown(
        userId,
        String(deleted.groupId),
        deleted.order,
        session
      );
    });
  } finally {
    session.endSession();
  }
}

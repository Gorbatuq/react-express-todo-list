import mongoose, { Types } from "mongoose";
import { AppError } from "../../errors/AppError";
import { taskRepo } from "../../repositories/taskRepo";
import { groupRepo } from "../../repositories/groupRepo";
import { toTaskDto } from "../../dto/taskDto";
import { ensureObjectId } from "../../utils/objectId";

type Updates = Partial<{
  title: string;
  completed: boolean;
  groupId: string;
  toIndex: number;
}>;

export async function updateTaskUsecase(
  userId: string,
  fromGroupId: string,
  taskId: string,
  body: Updates
) {
  ensureObjectId(userId, "userId");
  ensureObjectId(taskId, "taskId");
  ensureObjectId(fromGroupId, "groupId");

  const session = await mongoose.startSession();
  try {
    let dto!: ReturnType<typeof toTaskDto>;

    await session.withTransaction(async () => {
      const task = await taskRepo.findByIdForUser(taskId, userId, session);
      if (!task) throw new AppError(404, "TASK_NOT_FOUND", "Task not found");

      const realFromGroupId = String(task.groupId);
      const fromOrder = task.order;

      const toGroupId = body.groupId ?? realFromGroupId;
      ensureObjectId(toGroupId, "targetGroupId");

      const isMove = body.groupId !== undefined || body.toIndex !== undefined;

      if (body.title !== undefined) task.title = String(body.title).trim();
      if (body.completed !== undefined) task.completed = body.completed;

      if (!isMove) {
        await task.save({ session });
        dto = toTaskDto(task);
        return;
      }

      const targetGroup = await groupRepo.findByIdForUser(
        toGroupId,
        userId,
        session
      );
      if (!targetGroup)
        throw new AppError(404, "GROUP_NOT_FOUND", "Target group not found");

      const targetCount = await taskRepo.countByGroup(
        userId,
        toGroupId,
        session
      );
      const maxIndex =
        toGroupId === realFromGroupId
          ? Math.max(0, targetCount - 1)
          : targetCount;

      const raw = body.toIndex;
      const toIndex =
        typeof raw === "number"
          ? Math.max(0, Math.min(raw, maxIndex))
          : maxIndex;

      // Move to another group
      if (toGroupId !== realFromGroupId) {
        // 0) Put task into destination with TEMP order to avoid unique collisions
        task.groupId = new Types.ObjectId(toGroupId);
        task.order = -(toIndex + 1); // negative temp unique
        await task.save({ session });

        // 1) Close gap in source (task already moved out)
        await taskRepo.shiftOrdersDown(
          userId,
          realFromGroupId,
          fromOrder,
          session
        );

        // 2) Make room in destination
        await taskRepo.shiftOrdersUpFrom(userId, toGroupId, toIndex, session);

        // 3) Set final order
        task.order = toIndex;
        await task.save({ session });

        dto = toTaskDto(task);
        return;
      }

      // Reorder in same group
      if (toIndex === fromOrder) {
        await task.save({ session });
        dto = toTaskDto(task);
        return;
      }

      if (toIndex > fromOrder) {
        await taskRepo.shiftOrdersInRange(
          userId,
          realFromGroupId,
          { gt: fromOrder, lte: toIndex },
          -1,
          session
        );
      } else {
        await taskRepo.shiftOrdersInRange(
          userId,
          realFromGroupId,
          { gte: toIndex, lt: fromOrder },
          1,
          session
        );
      }

      task.order = toIndex;
      await task.save({ session });
      dto = toTaskDto(task);
    });

    return dto;
  } finally {
    session.endSession();
  }
}

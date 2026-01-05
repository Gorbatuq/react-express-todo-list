import mongoose from "mongoose";
import { AppError } from "../../errors/AppError";
import { taskRepo } from "../../repositories/taskRepo";
import { groupRepo } from "../../repositories/groupRepo";
import { toTaskDto } from "../../dto/taskDto";
import { ensureObjectId } from "../../utils/objectId";

type Body = { title: string };

export async function createTaskUsecase(
  userId: string,
  groupId: string,
  body: Body
) {
  ensureObjectId(userId, "userId");
  ensureObjectId(groupId, "groupId");

  const title = String(body?.title ?? "").trim();
  if (!title) throw new AppError(400, "VALIDATION_ERROR", "Title is required");

  const session = await mongoose.startSession();
  try {
    let dto!: ReturnType<typeof toTaskDto>;

    await session.withTransaction(async () => {
      const group = await groupRepo.findByIdForUser(groupId, userId, session);
      if (!group) throw new AppError(404, "GROUP_NOT_FOUND", "Group not found");

      const count = await taskRepo.countByGroup(userId, groupId, session);

      const created = await taskRepo.createOne(
        { title, completed: false, order: count, groupId, userId },
        session
      );

      dto = toTaskDto(created);
    });

    return dto;
  } finally {
    session.endSession();
  }
}

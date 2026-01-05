import mongoose from "mongoose";
import { AppError } from "../../errors/AppError";
import { groupRepo } from "../../repositories/groupRepo";
import { taskRepo } from "../../repositories/taskRepo";

export async function deleteGroupUsecase(userId: string, groupId: string) {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const deleted = await groupRepo.deleteByIdForUser(
        groupId,
        userId,
        session
      );
      if (!deleted)
        throw new AppError(404, "GROUP_NOT_FOUND", "Group not found");

      await taskRepo.deleteByGroup(groupId, userId, session);

      const groups = await groupRepo.listByUser(userId, session); // sorted already
      const idsInOrder = groups.map((g) => g._id.toString());
      await groupRepo.bulkSetOrder(userId, idsInOrder, session);
    });

    return { message: "Group deleted" };
  } finally {
    session.endSession();
  }
}

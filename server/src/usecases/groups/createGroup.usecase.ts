import mongoose from "mongoose";
import { AppError } from "../../errors/AppError";
import { groupRepo } from "../../repositories/groupRepo";
import { userRepo } from "../../repositories/userRepo";
import { TaskGroup } from "../../models/TaskGroup";
import { toGroupDto } from "../../dto/groupDto";

export async function createGroupUsecase(
  userId: string,
  body: { title: string; priority?: 1 | 2 | 3 | 4 }
) {
  const title = String(body.title).trim();
  const priority = (body.priority ?? 2) as 1 | 2 | 3 | 4;

  const session = await mongoose.startSession();
  try {
    let dto: ReturnType<typeof toGroupDto>;

    await session.withTransaction(async () => {
      const user = await userRepo.findById(userId);
      if (!user) throw new AppError(404, "USER_NOT_FOUND", "User not found");

      const count = await groupRepo.countByUser(userId, session);
      if (user.role === "GUEST" && count >= 3)
        throw new AppError(
          403,
          "GUEST_LIMIT",
          "Guest can create no more than 3 groups"
        );

      const group = await TaskGroup.create(
        [{ title, order: count, priority, userId }],
        { session }
      );

      dto = toGroupDto(group[0]);
    });

    return dto!;
  } finally {
    session.endSession();
  }
}

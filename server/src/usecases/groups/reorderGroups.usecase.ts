import mongoose from "mongoose";
import { AppError } from "../../errors/AppError";
import { groupRepo } from "../../repositories/groupRepo";
import { toGroupDto } from "../../dto/groupDto";

export async function reorderGroupsUsecase(
  userId: string,
  body: { order: string[] }
) {
  const { order } = body;

  const session = await mongoose.startSession();
  try {
    let out: ReturnType<typeof toGroupDto>[];

    await session.withTransaction(async () => {
      const groups = await groupRepo.listByUser(userId, session);

      if (groups.length === 0)
        throw new AppError(404, "GROUPS_NOT_FOUND", "No groups");
      if (order.length !== groups.length)
        throw new AppError(
          400,
          "ORDER_LENGTH_MISMATCH",
          "Order must include all groups"
        );

      const ids = groups.map((g) => g._id.toString());
      const idSet = new Set(ids);

      if (new Set(order).size !== order.length)
        throw new AppError(400, "DUPLICATE_IDS", "Order has duplicate ids");

      if (!order.every((id) => idSet.has(id)))
        throw new AppError(
          403,
          "FOREIGN_GROUP",
          "Order contains foreign group ids"
        );

      await groupRepo.bulkSetOrder(userId, order, session);

      const updated = await groupRepo.listByUser(userId, session);
      out = updated.map(toGroupDto);
    });

    return out!;
  } finally {
    session.endSession();
  }
}

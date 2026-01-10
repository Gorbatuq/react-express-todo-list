import { AppError } from "../../errors/AppError";
import { TaskGroup } from "../../models/TaskGroup";
import { toGroupDto } from "../../dto/groupDto";

export async function updateGroupUsecase(
  userId: string,
  groupId: string,
  body: Partial<{ title: string; priority: 1 | 2 | 3 | 4 }>
) {
  const updates: any = {};
  if (body.title !== undefined) updates.title = String(body.title).trim();
  if (body.priority !== undefined) updates.priority = body.priority;

  const group = await TaskGroup.findOneAndUpdate(
    { _id: groupId, userId },
    { $set: updates },
    { new: true }
  );

  if (!group) throw new AppError(404, "GROUP_NOT_FOUND", "Group not found");
  return toGroupDto(group);
}

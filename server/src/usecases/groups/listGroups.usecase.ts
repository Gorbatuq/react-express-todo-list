import { groupRepo } from "../../repositories/groupRepo";
import { toGroupDto } from "../../dto/groupDto";

export async function listGroupsUsecase(userId: string) {
  const groups = await groupRepo.listByUser(userId);
  return groups.map(toGroupDto);
}

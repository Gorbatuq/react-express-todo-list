import { taskRepo } from "../../repositories/taskRepo";
import { toTaskDto } from "../../dto/taskDto";

export async function listTasksUsecase(userId: string, groupId: string) {
  const tasks = await taskRepo.listByGroup(userId, groupId);
  return tasks.map(toTaskDto as any);
}

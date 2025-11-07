import { api, safeRequest } from "./http";
import type { Task } from "../types";

export const taskApi = {
  getTasksByGroup: (groupId: string): Promise<Task[]> =>
    safeRequest(api.get<Task[]>(`/groups/${groupId}/tasks`)),

  add: (groupId: string, title: string): Promise<Task> =>
    safeRequest(api.post<Task>(`/groups/${groupId}/tasks`, { title })),

  move: (groupId: string, taskId: string, newGroupId: string): Promise<{ message: string }> =>
    safeRequest(api.patch<{ message: string }>(
      `/groups/${groupId}/tasks/${taskId}`,
      { groupId: newGroupId }
    )),

  delete: (groupId: string, taskId: string): Promise<{ message: string }> =>
    safeRequest(api.delete<{ message: string }>(
      `/groups/${groupId}/tasks/${taskId}`
    )),

  reorder: (groupId: string, taskIds: string[]): Promise<{ message: string }> =>
    safeRequest(api.patch<{ message: string }>(
      `/groups/${groupId}/tasks/order`,
      { order: taskIds }
    )),

  update: (
    groupId: string,
    taskId: string,
    payload: Partial<Pick<Task, "title" | "completed" | "groupId">>
  ): Promise<Task> =>
    safeRequest(api.patch<Task>(
      `/groups/${groupId}/tasks/${taskId}`,
      payload
    )),
};

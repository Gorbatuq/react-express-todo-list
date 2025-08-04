import { api, safeRequest } from "./http";
import type { Task } from "../types";

export const taskApi = {

  getTasksByGroup: (groupId: string) =>
    safeRequest<Task[]>(api.get(`/groups/${groupId}/tasks`)),

  add: (groupId: string, title: string) =>
    safeRequest<Task>(api.post(`/groups/${groupId}/tasks`, { title })),


  reorder: (groupId: string, taskIds: string[]) =>
    safeRequest<{ message: string }>(
      api.patch(`/groups/${groupId}/tasks/order`, { order: taskIds })
    ),

  move: (groupId: string, taskId: string, newGroupId: string) =>
    safeRequest<{ message: string }>(
      api.patch(`/groups/${groupId}/tasks/${taskId}`, { groupId: newGroupId })
    ),

  delete: (groupId: string, taskId: string) =>
    safeRequest<{ message: string }>(
      api.delete(`/groups/${groupId}/tasks/${taskId}`)
    ),

  update: (
    groupId: string,
    taskId: string,
    payload: Partial<Pick<Task, "title" | "completed" | "groupId">>
  ) =>
    safeRequest<Task>(
      api.patch(`/groups/${groupId}/tasks/${taskId}`, payload)
    ),
};

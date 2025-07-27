import { api, safeRequest } from "./http";
import type { Task, TaskGroup } from "../../../types";

export const taskApi = {
  add: (groupId: string, title: string) =>
    safeRequest<Task>(api.post(`/task-groups/${groupId}/tasks`, { title })),

  delete: (groupId: string, taskId: string) =>
    safeRequest<{ message: string }>(api.delete(`/task-groups/${groupId}/tasks/${taskId}`)),

  toggle: (groupId: string, taskId: string) =>
    safeRequest<Task>(api.put(`/task-groups/${groupId}/tasks/${taskId}/toggle`)),

  updateTitle: (groupId: string, taskId: string, title: string) =>
    safeRequest<Task>(api.put(`/task-groups/${groupId}/tasks/${taskId}/title`, { title })),

  reorder: (groupId: string, taskIds: string[]) =>
    safeRequest<TaskGroup>(api.patch(`/task-groups/${groupId}/tasks/order`, { order: taskIds })),

  move: (sourceGroupId: string, taskId: string, targetGroupId: string) =>
    safeRequest<{ message: string }>(
      api.patch(`/task-groups/${sourceGroupId}/tasks/${taskId}/move/${targetGroupId}`)
    ),

  getByGroupId: (groupId: string) =>
    safeRequest<Task[]>(api.get(`/task-groups/${groupId}/tasks`)),

};

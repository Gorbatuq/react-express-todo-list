import { api, safeRequest } from "./http";
import type { TaskGroup } from "../../../types";

export const groupApi = {

  getAll: () => safeRequest<TaskGroup[]>(api.get("/task-groups")),

  create: (title: string) =>
    safeRequest<TaskGroup>(api.post("/task-groups", { title })),

  delete: (groupId: string) =>
    safeRequest<{ message: string }>(api.delete(`/task-groups/${groupId}`)),

  updateTitle: (groupId: string, title: string) =>
    safeRequest<TaskGroup>(api.put(`/task-groups/${groupId}`, { title })),

  reorder: (groupIds: string[]) =>
    safeRequest<{ message: string }>(api.patch("/task-groups/order", { order: groupIds })),
  
};

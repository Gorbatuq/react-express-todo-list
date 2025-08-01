import { api, safeRequest } from "./http";
import type { TaskGroup } from "../types";

export const groupApi = {
  getAll: () => safeRequest<TaskGroup[]>(api.get("/groups")),

  create: (title: string) =>
    safeRequest<TaskGroup>(api.post("/groups", { title })),

  delete: (groupId: string) =>
    safeRequest<{ message: string }>(api.delete(`/groups/${groupId}`)),

  updateTitle: (groupId: string, title: string) =>
    safeRequest<TaskGroup>(api.patch(`/groups/${groupId}`, { title })),

  reorder: (groupIds: string[]) =>
    safeRequest<{ message: string }>(api.patch("/groups/order", { order: groupIds })),
};

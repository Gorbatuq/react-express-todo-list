import { api, safeRequest } from "./http";
import type { Priority, TaskGroup } from "../types";

export const groupApi = {

  getAll: () => safeRequest<TaskGroup[]>(api.get("/groups")),

  create: (data: { title: string; priority: Priority  }) =>
    safeRequest<TaskGroup>(api.post("/groups", data)),

  delete: (groupId: string) =>
    safeRequest<{ message: string }>(api.delete(`/groups/${groupId}`)),

  update: (groupId: string, data: { title?: string; priority?: Priority  }) =>
    safeRequest<TaskGroup>(api.patch(`/groups/${groupId}`, data)),

  reorder: (groupIds: string[]) =>
    safeRequest<{ message: string }>(api.patch("/groups/order", { order: groupIds })),
  
};

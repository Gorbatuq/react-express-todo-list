import { api, safeRequest } from "./http";
import type { Priority, TaskGroup } from "../types";

interface CrateGroupDto {
  title: string; 
  priority: Priority
}

interface UpdateGroupDto { 
  title?: string; 
  priority?: Priority  
}

export const groupApi = {
  getAll: () => safeRequest(api.get<TaskGroup[]>("/groups")),

  create: (data: CrateGroupDto): Promise<TaskGroup> =>
    safeRequest(api.post<TaskGroup>("/groups", data)),

  delete: (groupId: string): Promise<{ message: string }> =>
    safeRequest(api.delete<{ message: string }>(`/groups/${groupId}`)),

  update: (groupId: string, data: UpdateGroupDto): Promise<TaskGroup> =>
    safeRequest(api.patch<TaskGroup>(`/groups/${groupId}`, data)),

  reorder: (groupIds: string[]): Promise<{ message: string }> =>
    safeRequest(api.patch<{ message: string }>("/groups/order", { order: groupIds })),
  
};

import { request } from "../core/request";
import {
  createGroupDtoSchema,
  reorderGroupsDtoSchema,
  taskGroupListSchema,
  taskGroupSchema,
  updateGroupDtoSchema,
} from "../schema/groups";

export const groupsApi = {
  getAll: () => request({ method: "GET", url: "/groups" }, taskGroupListSchema),

  create: (data: unknown) =>
    request(
      {
        method: "POST",
        url: "/groups",
        data: createGroupDtoSchema.parse(data),
      },
      taskGroupSchema
    ),

  update: (groupId: string, data: unknown) =>
    request(
      {
        method: "PATCH",
        url: `/groups/${groupId}`,
        data: updateGroupDtoSchema.parse(data),
      },
      taskGroupSchema
    ),

  delete: (groupId: string) =>
    request({ method: "DELETE", url: `/groups/${groupId}` }),

  reorder: (groupIds: string[]) =>
    request(
      {
        method: "PATCH",
        url: "/groups/order",
        data: reorderGroupsDtoSchema.parse({ order: groupIds }),
      },
      taskGroupListSchema
    ),
};

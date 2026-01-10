import { request } from "../core/request";
import {
  addTaskDtoSchema,
  reorderTasksDtoSchema,
  taskListSchema,
  taskSchema,
  updateTaskDtoSchema,
} from "../schema/tasks";

export const tasksApi = {
  getByGroupId: (groupId: string) =>
    request({ method: "GET", url: `/groups/${groupId}/tasks` }, taskListSchema),

  create: (groupId: string, data: unknown) =>
    request(
      {
        method: "POST",
        url: `/groups/${groupId}/tasks`,
        data: addTaskDtoSchema.parse(data),
      },
      taskSchema
    ),

  update: (groupId: string, taskId: string, data: unknown) =>
    request(
      {
        method: "PATCH",
        url: `/groups/${groupId}/tasks/${taskId}`,
        data: updateTaskDtoSchema.parse(data),
      },
      taskSchema
    ),

  delete: (groupId: string, taskId: string) =>
    request({
      method: "DELETE",
      url: `/groups/${groupId}/tasks/${taskId}`,
    }),

  reorder: (groupId: string, taskIds: string[]) =>
    request({
      method: "PATCH",
      url: `/groups/${groupId}/tasks/order`,
      data: reorderTasksDtoSchema.parse({ order: taskIds }),
    }),

  // import: (groupId: string, data: unknown) =>
  //   request({
  //     method: "POST",
  //     url: `/groups/${groupId}/tasks/import`,
  //     data,
  //   }),
};

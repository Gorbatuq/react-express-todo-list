import { z } from "zod";
import { idSchema } from "./common";

export const taskSchema = z.object({
  id: idSchema,
  title: z.string(),
  completed: z.boolean(),
  order: z.number(),
  groupId: idSchema,
});
export type TaskDto = z.infer<typeof taskSchema>;
export const taskListSchema = z.array(taskSchema);

export const addTaskDtoSchema = z.object({
  title: z.string().min(1),
});
export type AddTaskDto = z.infer<typeof addTaskDtoSchema>;

export const moveTaskDtoSchema = z.object({
  groupId: idSchema, // newGroupId
  toIndex: z.number().int().min(0),
});
export type MoveTaskDto = z.infer<typeof moveTaskDtoSchema>;

export const reorderTasksDtoSchema = z.object({
  order: z.array(idSchema).min(1),
});
export type ReorderTasksDto = z.infer<typeof reorderTasksDtoSchema>;

export const updateTaskDtoSchema = z
  .object({
    title: z.string().min(1).optional(),
    completed: z.boolean().optional(),
    groupId: idSchema.optional(),
    toIndex: z.number().int().min(0).optional(),
  })
  .refine((v) => Object.values(v).some((x) => x !== undefined), {
    message: "Empty update payload",
  });
export type UpdateTaskDto = z.infer<typeof updateTaskDtoSchema>;

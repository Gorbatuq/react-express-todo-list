import { z } from "zod";


const id = z.string().min(1, "ID is required");
const title = z.string().min(1, "Title is required").max(400, "Max 400 chars");


export const createTaskSchema = z.object({
  title,
});

export const updateTaskSchema = z
  .object({
    title: title.optional(),
    completed: z.boolean().optional(),
    groupId: id.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const reorderTaskSchema = z.object({
  order: z.array(id).min(1, "Order is required"),
});


export const groupIdParamSchema = z.object({ groupId: id });
export const taskIdParamSchema = z.object({ taskId: id });
export const groupAndTaskIdParamSchema = z.object({
  groupId: id,
  taskId: id,
});

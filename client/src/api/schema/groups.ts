import { z } from "zod";
import { idSchema, prioritySchema } from "./common";

// Matches backend GroupDto (no userId)
export const taskGroupSchema = z.object({
  id: idSchema,
  title: z.string(),
  order: z.number(),
  priority: prioritySchema,
});

export type TaskGroupDto = z.infer<typeof taskGroupSchema>;
export const taskGroupListSchema = z.array(taskGroupSchema);

export const createGroupDtoSchema = z.object({
  title: z.string().min(1).max(400),
  priority: prioritySchema.optional(),
});

export const updateGroupDtoSchema = z
  .object({
    title: z.string().min(1).max(400).optional(),
    priority: prioritySchema.optional(),
  })
  .refine(
    (v) => Object.values(v).some((x) => x !== undefined),
    "At least one field required"
  );

export const reorderGroupsDtoSchema = z.object({
  order: z.array(idSchema).min(1),
});

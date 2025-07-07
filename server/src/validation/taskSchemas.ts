import { z } from "zod";

// ===== BASE SCHEMAS =====

export const idSchema = z.string().min(1, "ID is required");

export const titleSchema = z.string()
  .min(1, "Title is required")
  .max(100, "Max 100 characters");

// ===== BODY SCHEMAS =====

export const createTaskSchema = z.object({
  title: titleSchema,
});

export const updateTaskTitleSchema = z.object({
  title: titleSchema,
});

export const createGroupSchema = z.object({
  title: titleSchema,
});

export const reorderGroupsSchema = z.object({
  order: z.array(idSchema).min(1, "Order must have at least one ID"),
});

export const reorderTaskSchema = z.object({
  order: z.array(idSchema).min(1, "Order must have at least one ID"),
});

// ===== PARAMS SCHEMAS =====

export const groupIdParamSchema = z.object({
  groupId: idSchema,
});

export const groupTaskParamsSchema = z.object({
  groupId: idSchema,
  taskId: idSchema,
});

export const moveTaskParamsSchema = z.object({
  sourceGroupId: idSchema,
  taskId: idSchema,
  targetGroupId: idSchema,
});

export const idParamSchema = z.object({
  id: idSchema,
});

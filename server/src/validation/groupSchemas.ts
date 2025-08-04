import { z } from "zod";

const idSchema = z.string().min(1);
const titleSchema = z.string().min(1).max(400);
const prioritySchema = z.number().min(1).max(4);

// POST /groups
export const createGroupSchema = z.object({
  title: titleSchema,
  priority: z.number().min(1).max(4).optional(), // default on the front, here optional
});

// PATCH /groups/:groupId
export const updateGroupSchema = z
  .object({
    title: titleSchema.optional(),
    priority: prioritySchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

// PATCH /groups/order
export const reorderGroupsSchema = z.object({
  order: z.array(z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId")),
});

// id
export const groupIdParamSchema = z.object({
  groupId: idSchema,
});

export const idParamSchema = z.object({
  id: idSchema,
});

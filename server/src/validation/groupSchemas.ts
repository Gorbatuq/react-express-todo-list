import { z } from "zod";

const idSchema = z.string().min(1);
const titleSchema = z.string().min(1).max(400);

export const createGroupSchema = z.object({ title: titleSchema });
export const reorderGroupsSchema = z.object({
  order: z.array(z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId")),
});

export const groupIdParamSchema = z.object({
  groupId: idSchema,
});
export const idParamSchema = z.object({
  id: idSchema,
});

import { z } from "zod";
import { objectId } from "./common";

const title = z.string().min(1).max(400);
const priority = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
]);

export const createGroupSchema = z.object({
  title,
  priority: priority.optional(),
});

export const updateGroupSchema = z
  .object({
    title: title.optional(),
    priority: priority.optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "At least one field must be provided",
  });

export const reorderGroupsSchema = z.object({
  order: z
    .array(objectId)
    .min(1)
    .refine((v) => new Set(v).size === v.length, "Duplicate group ids"),
});

export const groupIdParamSchema = z.object({
  groupId: objectId,
});

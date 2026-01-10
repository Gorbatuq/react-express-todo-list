import { z } from "zod";
import { objectId } from "./common";

const title = z.string().min(1).max(400);

export const createTaskSchema = z.object({
  title,
});

export const updateTaskSchema = z
  .object({
    title: title.optional(),
    completed: z.boolean().optional(),
    groupId: objectId.optional(),
    toIndex: z.number().int().min(0).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "At least one field must be provided",
  });

export const reorderTaskSchema = z.object({
  order: z
    .array(objectId)
    .min(1)
    .refine((v) => new Set(v).size === v.length, "Duplicate task ids"),
});

// export const importTaskSchema = z.object({
//   tasks: z.array(
//     z.object({
//       title,
//       groupId: objectId,
//       order: z.number().int().min(0),
//       completed: z.boolean().optional(),
//     })
//   ),
// });

export const groupIdParamSchema = z.object({
  groupId: objectId,
});

export const taskIdParamSchema = z.object({
  taskId: objectId,
});

export const groupAndTaskIdParamSchema = z.object({
  groupId: objectId,
  taskId: objectId,
});

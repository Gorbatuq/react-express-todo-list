import { z } from "zod";

export const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

// Back-compat alias
export const idSchema = objectIdSchema;

export const prioritySchema = z.number().int().min(1).max(4);

export const messageSchema = z.object({ message: z.string() });
export type MessageDto = z.infer<typeof messageSchema>;

import { z } from "zod";
import { idSchema } from "./common";

export const userSchema = z.object({
  id: idSchema,
  email: z.email(),
  role: z.enum(["USER", "GUEST"]),
  createdAt: z.string(),
  taskCount: z.number().optional(),
});

export type UserDto = z.infer<typeof userSchema>;

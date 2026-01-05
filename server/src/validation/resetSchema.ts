import { z } from "zod";

export const resetSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8),
});

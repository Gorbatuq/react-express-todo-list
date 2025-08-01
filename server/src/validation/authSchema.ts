import { z } from "zod";

export const authSchema = z.object({
  email: z.string().min(4), // temporarily remove the email
  password: z.string().min(4),
});

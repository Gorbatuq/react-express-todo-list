import z from "zod";

/// change in production
export const authInputSchema = z.object({
  email: z.string().min(4, "Email must be at least 4 characters"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export type AuthInputValues = z.infer<typeof authInputSchema>;
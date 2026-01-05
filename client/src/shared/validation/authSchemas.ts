import z from "zod";

/// change in production
export const authInputSchema = z.object({
  email: z.string().min(4, "Email must be at least 4 characters"), // change
  password: z.string().min(4, "Password must be at least 4 characters"), // change
});

export type AuthInputValues = z.infer<typeof authInputSchema>;

export const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Min 8 chars")
      .regex(/[A-Z]/, "At least one uppercase letter")
      .regex(/[a-z]/, "At least one lowercase letter")
      .regex(/[0-9]/, "At least one number"),

    confirm: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirm) {
      ctx.addIssue({
        path: ["confirm"],
        message: "Passwords do not match",
        code: "custom",
      });
    }
  });

export type passwordType = z.infer<typeof passwordSchema>;

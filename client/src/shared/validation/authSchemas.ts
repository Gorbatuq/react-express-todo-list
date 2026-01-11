import z from "zod";

export const authInputSchema = z.object({
  email: z.email("Invalid email").max(128, "Email too long"),
  password: z.string().min(8, "Min 8 characters").max(128, "Max 32 characters"),
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

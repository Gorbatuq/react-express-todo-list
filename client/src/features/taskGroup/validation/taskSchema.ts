import z from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim() 
    .min(3, "Minimum 3 characters")
    .max(400, "Maximum 400 characters")
    .refine((val) => val.replace(/\s/g, "").length > 0, {
      message: "Cannot be empty or whitespace only",
    }),
});

export type TaskInputValues = z.infer<typeof taskSchema>;

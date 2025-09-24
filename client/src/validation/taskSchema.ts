import z from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(400, "Maximum 400 characters")
    .regex(/[^\s]/, "Cannot be empty or whitespace only"),
});




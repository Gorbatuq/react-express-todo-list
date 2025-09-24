import z from "zod";

export const groupSchema = z.object({
  title: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(25, "Maximum 25 characters")
    .regex(/[^\s]/, "Cannot be empty or whitespace only"),
  priority: z.number().min(1).max(4).default(2),
});



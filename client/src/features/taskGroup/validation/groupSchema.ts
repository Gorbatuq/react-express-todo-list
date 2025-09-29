import z from "zod";

export const groupSchema = z.object({
  title: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(100, "Maximum 100 characters")
    .regex(/[^\s]/, "Cannot be empty or whitespace only"),
  priority: z.number().min(1).max(4).default(2),
});


export type GroupInputValues = z.infer<typeof groupSchema>;
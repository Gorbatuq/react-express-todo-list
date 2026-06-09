import z from "zod";
import { DEFAULT_PRIORITY, PRIORITY_OPTIONS, type Priority } from "../../../types";

const priorityValues = PRIORITY_OPTIONS.map((option) => option.value);

export const groupSchema = z.object({
  title: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(100, "Maximum 100 characters")
    .regex(/[^\s]/, "Cannot be empty or whitespace only"),
  priority: z
    .number()
    .refine((value): value is Priority =>
      priorityValues.includes(value as Priority),
    )
    .default(DEFAULT_PRIORITY),
});


export type GroupInputValues = z.infer<typeof groupSchema>;

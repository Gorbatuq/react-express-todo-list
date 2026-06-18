import z from "zod";
import { TASK_TITLE_MAX_LENGTH } from "../constants/textLimits";

export const taskSchema = z.object({
  title: z
    .string()
    .trim() 
    .min(3, "Minimum 3 characters")
    .max(TASK_TITLE_MAX_LENGTH, `Maximum ${TASK_TITLE_MAX_LENGTH} characters`)
    .refine((val) => val.replace(/\s/g, "").length > 0, {
      message: "Cannot be empty or whitespace only",
    }),
});

export type TaskInputValues = z.infer<typeof taskSchema>;

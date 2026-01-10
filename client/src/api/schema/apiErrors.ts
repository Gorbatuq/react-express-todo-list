import { z } from "zod";

export const apiFieldErrorsSchema = z.record(z.string(), z.array(z.string()));
export type ApiFieldErrors = z.infer<typeof apiFieldErrorsSchema>;

export const apiErrorSchema = z.object({
  status: z.number(),
  code: z.string(),
  message: z.string(),
  fields: apiFieldErrorsSchema.optional(),
  requestId: z.string().optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

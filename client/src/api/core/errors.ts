import { apiErrorSchema, type ApiError } from "../schema/apiErrors";

export type { ApiError };
export { apiErrorSchema };

export const isApiError = (e: unknown): e is ApiError =>
  apiErrorSchema.safeParse(e).success;

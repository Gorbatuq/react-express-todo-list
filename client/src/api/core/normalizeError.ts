import axios from "axios";
import type { ApiError } from "./errors";
import { apiErrorSchema } from "./errors";
import { unwrapEnvelope } from "./envelope";

function fallback(status: number, message: string): ApiError {
  return { status, code: "UNKNOWN", message };
}

export function normalizeAxiosError(err: unknown): ApiError {
  if (!axios.isAxiosError(err)) {
    return fallback(0, "Non-HTTP error");
  }

  const status = err.response?.status ?? 0;
  const raw = err.response?.data;
  const { data, requestId } = unwrapEnvelope(raw);

  if (data && typeof data === "object") {
    const parsed = apiErrorSchema.safeParse({
      status,
      requestId,
      ...data,
    });
    if (parsed.success) return parsed.data;
  }

  // Network / timeout
  if (status === 0) {
    if (err.code === "ECONNABORTED") {
      return {
        status: 0,
        code: "TIMEOUT",
        message: "Request timed out",
        requestId,
      };
    }
    return {
      status: 0,
      code: "NETWORK_ERROR",
      message: "Network error",
      requestId,
    };
  }

  // HTTP statuses
  if (status === 401)
    return { status, code: "UNAUTHORIZED", message: "Unauthorized", requestId };
  if (status === 403)
    return { status, code: "FORBIDDEN", message: "Forbidden", requestId };
  if (status === 404)
    return { status, code: "NOT_FOUND", message: "Not found", requestId };
  if (status === 422)
    return {
      status,
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      requestId,
    };
  if (status >= 500)
    return {
      status,
      code: "SERVER_ERROR",
      message: "Server error",
      requestId,
    };

  return {
    status,
    code: "REQUEST_FAILED",
    message: err.message || "Request failed",
    requestId,
  };
}

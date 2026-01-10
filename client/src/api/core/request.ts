import type { ZodType } from "zod";
import { ZodError } from "zod";
import type { AxiosRequestConfig } from "axios";
import { api } from "./http";
import type { ApiError } from "./errors";
import { ApiFieldErrors } from "../schema";
import { unwrapEnvelope } from "./envelope";

function zodToFields(e: ZodError): ApiFieldErrors {
  const out: ApiFieldErrors = {};
  for (const issue of e.issues) {
    const key = issue.path.length ? issue.path.join(".") : "_";
    (out[key] ??= []).push(issue.message);
  }
  return out;
}

export async function request(config: AxiosRequestConfig): Promise<void>;
export async function request<T>(
  config: AxiosRequestConfig,
  schema: ZodType<T>
): Promise<T>;
export async function request<T>(
  config: AxiosRequestConfig,
  schema?: ZodType<T>
): Promise<T | void> {
  const res = await api.request(config);

  if (res.status === 204 || res.data == null || res.data === "") return;

  const { data, requestId } = unwrapEnvelope(res.data);

  if (!schema) return;

  try {
    return schema.parse(data);
  } catch (e) {
    if (e instanceof ZodError) {
      const err: ApiError = {
        status: 502,
        code: "RESPONSE_VALIDATION_ERROR",
        message: "Response does not match API contract",
        fields: zodToFields(e),
        requestId,
      };
      throw err;
    }

    throw {
      status: 502,
      code: "RESPONSE_VALIDATION_ERROR",
      message: "Invalid response",
      requestId,
    } satisfies ApiError;
  }
}

import axios from "axios";
import type { AxiosInstance } from "axios";
import type { ApiError } from "./errors";
import { normalizeAxiosError } from "./normalizeError";

const baseURL: string = (import.meta as any).env?.VITE_API_BASE_URL ?? "/api";

export const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15_000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject<ApiError>(normalizeAxiosError(err))
);

import axios from "axios";
import type { AxiosInstance } from "axios";
import type { ApiError } from "./errors";
import { normalizeAxiosError } from "./normalizeError";

const baseURL: string = "/api";

const SEC = 1000;
const API_TIMEOUT = 15 * SEC;

export const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: API_TIMEOUT,
});

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject<ApiError>(normalizeAxiosError(err))
);

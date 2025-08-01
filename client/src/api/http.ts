import axios from "axios";
import type { AxiosResponse } from "axios";


export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ===== SAFE REQUEST WRAPPER =====

export async function safeRequest<T>(promise: Promise<AxiosResponse<T>>): Promise<T> {
  try {
    const res = await promise;
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

// ===== GLOBAL ERROR HANDLER =====

function handleApiError(error: unknown): void {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401) {
      console.warn("Unauthorized");
    }

    console.error("Axios error:", status, data || error.message);
  } else {
    console.error("Unknown error:", error);
  }
}

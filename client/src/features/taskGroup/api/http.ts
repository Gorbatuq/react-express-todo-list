import axios from "axios";
import type { AxiosResponse } from "axios";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("VITE_API_URL is not defined");

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export const safeRequest = async <T>(promise: Promise<AxiosResponse<T>>): Promise<T> => {
  try {
    const res = await promise;
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("API Axios error:", err.response?.data || err.message);
    } else {
      console.error("Unknown error:", err);
    }
    throw err;
  }
};

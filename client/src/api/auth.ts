import { api, safeRequest } from "./http";
import type { User } from "../types";

export const authApi = {
  
  getMe: async (): Promise<User> => {
    const res = await api.get("/auth/me");
    return res.data as User},

  register: (email: string, password: string) =>
    safeRequest(api.post("/auth/register", { email, password })),

  login: (email: string, password: string) =>
    safeRequest(api.post("/auth/login", { email, password })),

  logout: () =>
    safeRequest(api.post("/auth/logout")),

  createGuest: () => {
  return safeRequest(api.post("/auth/guest"));
  },  
};

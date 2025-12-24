import { api, safeRequest } from "./http";
import type { User } from "../types";

export const authApi = {
  getMe: (): Promise<User> => safeRequest(api.get<User>("/auth/me")),

  register: (email: string, password: string): Promise<User> =>
    safeRequest(api.post<User>("/auth/register", { email, password })),

  login: (email: string, password: string): Promise<User> =>
    safeRequest(api.post<User>("/auth/login", { email, password })),

  logout: (): Promise<void> => safeRequest(api.post("/auth/logout")),

  createGuest: (): Promise<User> => safeRequest(api.post<User>("/auth/guest")),

  forgotPassword: (email: string) =>
    safeRequest(api.post("/auth/forgot-password", { email })),

  resetPassword: (token: string, newPassword: string) =>
    safeRequest(api.post("/auth/reset-password", { token, newPassword })),
};

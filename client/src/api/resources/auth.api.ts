import { request } from "../core/request";
import { messageSchema } from "../schema";
import { userSchema } from "../schema/auth";

export const authApi = {
  getMe: () => request({ method: "GET", url: "/auth/me" }, userSchema),

  register: (email: string, password: string) =>
    request(
      {
        method: "POST",
        url: "/auth/register",
        data: { email, password },
      },
      userSchema
    ),

  login: (email: string, password: string) =>
    request(
      {
        method: "POST",
        url: "/auth/login",
        data: { email, password },
      },
      userSchema
    ),

  logout: () => request({ method: "POST", url: "/auth/logout" }),

  createGuest: () =>
    request({ method: "POST", url: "/auth/guest" }, userSchema),

  forgotPassword: (email: string) =>
    request(
      {
        method: "POST",
        url: "/auth/forgot-password",
        data: { email },
      },
      messageSchema
    ),

  resetPassword: (token: string, newPassword: string) =>
    request(
      {
        method: "POST",
        url: "/auth/reset-password",
        data: { token, newPassword },
      },
      messageSchema
    ),
};

import type { Response } from "express";
import { env } from "../config/env";

const isProd = env.NODE_ENV === "production";

export function setTokenCookie(res: Response, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? env.COOKIE_SAMESITE : "lax") as
      | "lax"
      | "strict"
      | "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function clearTokenCookie(res: Response) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? env.COOKIE_SAMESITE : "lax") as
      | "lax"
      | "strict"
      | "none",
    path: "/",
  });
}

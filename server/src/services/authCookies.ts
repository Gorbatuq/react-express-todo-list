import type { Response } from "express";
import { env } from "../config/env";

const isProd = env.NODE_ENV === "production";

const cookieBase = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? env.COOKIE_SAMESITE : "lax") as "lax" | "strict" | "none",
  path: "/",
};

export function setTokenCookie(res: Response, token: string) {
  res.cookie("token", token, { ...cookieBase, maxAge: env.COOKIE_MAX_AGE_MS });
}

export function clearTokenCookie(res: Response) {
  res.clearCookie("token", cookieBase);
}

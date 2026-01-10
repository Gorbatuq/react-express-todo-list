import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function sameOrigin(origin: string, allowed: string) {
  try {
    const o = new URL(origin);
    const a = new URL(allowed);
    return o.origin === a.origin;
  } catch {
    return false;
  }
}

export function csrfGuard(req: Request, _res: Response, next: NextFunction) {
  if (SAFE_METHODS.has(req.method)) return next();

  if (env.NODE_ENV !== "production") return next();

  const origin = req.headers.origin;
  if (!origin || !sameOrigin(origin, env.FRONTEND_ORIGIN)) {
    return next(new AppError(403, "CSRF", "Invalid origin"));
  }

  return next();
}

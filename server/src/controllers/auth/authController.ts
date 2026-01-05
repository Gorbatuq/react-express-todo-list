import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../errors/AppError";
import { ok, created, noContent } from "../../http/response";

import {
  meUsecase,
  registerUsecase,
  loginUsecase,
  logoutUsecase,
  createGuestUsecase,
  forgotPasswordUsecase,
  resetPasswordUsecase,
} from "../../usecases/auth";

import { setTokenCookie, clearTokenCookie } from "../../services/authCookies";

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Unauthorized");
    const user = await meUsecase(req.user.id);
    return ok(res, user);
  } catch (e) {
    next(e);
  }
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { user, token } = await registerUsecase(req.body);
    setTokenCookie(res, token);
    return created(res, user);
  } catch (e) {
    next(e);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { user, token } = await loginUsecase(req.body);
    setTokenCookie(res, token);
    return ok(res, user);
  } catch (e) {
    next(e);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    await logoutUsecase();
    clearTokenCookie(res);
    return noContent(res);
  } catch (e) {
    next(e);
  }
}

export async function createGuest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { user, token } = await createGuestUsecase();
    setTokenCookie(res, token);
    return created(res, user);
  } catch (e) {
    next(e);
  }
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await forgotPasswordUsecase(req.body);
    return ok(res, data);
  } catch (e) {
    next(e);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await resetPasswordUsecase(req.body);
    return ok(res, data);
  } catch (e) {
    next(e);
  }
}

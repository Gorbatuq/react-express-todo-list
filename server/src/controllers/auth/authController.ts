import type { Request, Response } from "express";
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
import { asyncHandler } from "../../middleware/asyncHandler";

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Unauthorized");
  const user = await meUsecase(req.user.id);
  return ok(res, user);
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { user, token } = await registerUsecase(req.body);
  setTokenCookie(res, token);
  return created(res, user);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, token } = await loginUsecase(req.body);
  setTokenCookie(res, token);
  return ok(res, user);
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  await logoutUsecase();
  clearTokenCookie(res);
  return noContent(res);
});

export const createGuest = asyncHandler(
  async (_req: Request, res: Response) => {
    const { user, token } = await createGuestUsecase();
    setTokenCookie(res, token);
    return created(res, user);
  }
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await forgotPasswordUsecase(req.body);
    return ok(res, data);
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await resetPasswordUsecase(req.body);
    return ok(res, data);
  }
);

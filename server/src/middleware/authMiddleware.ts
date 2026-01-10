import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { AppError } from "../errors/AppError";
import { env } from "../config/env";

const JWT_SECRET = env.JWT_SECRET!;

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;
  if (!token)
    return next(new AppError(401, "UNAUTHORIZED", "No token provided"));

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select("_id role");
    if (!user)
      return next(new AppError(401, "UNAUTHORIZED", "Invalid token user"));

    req.user = { id: decoded.id, role: user.role };
    return next();
  } catch {
    return next(new AppError(401, "UNAUTHORIZED", "Invalid or expired token"));
  }
};

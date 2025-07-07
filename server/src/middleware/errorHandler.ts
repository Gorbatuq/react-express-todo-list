import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof Error) {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error", error: err.message });
  } else {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: String(err) });
  }
}


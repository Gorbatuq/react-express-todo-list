import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import type { ApiErrorBody } from "../http/response";

function safeRequestId(req: Request) {
  return req.requestId || "missing-request-id";
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const requestId = safeRequestId(req);

  if (err instanceof AppError) {
    const body: ApiErrorBody = {
      code: err.code,
      message: err.message,
      fields: err.fields,
      requestId,
    };
    return res.status(err.status).json(body);
  }

  // Avoid dumping secrets / queries; keep logs minimal
  console.error("[INTERNAL]", { requestId, err });

  const body: ApiErrorBody = {
    code: "INTERNAL",
    message: "Internal server error",
    requestId,
  };
  return res.status(500).json(body);
}

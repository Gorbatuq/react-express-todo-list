import type { Response } from "express";

export type ApiSuccess<T> = {
  data: T;
  requestId: string;
};

export type ApiErrorBody = {
  code: string;
  message: string;
  fields?: Record<string, string[]>;
  requestId: string;
};

function getRequestId(res: Response): string {
  const v = res.getHeader("x-request-id");
  if (typeof v === "string" && v) return v;
  return "missing-request-id";
}

export function ok<T>(res: Response, data: T) {
  return res.status(200).json({
    data,
    requestId: getRequestId(res),
  } satisfies ApiSuccess<T>);
}

export function created<T>(res: Response, data: T) {
  return res.status(201).json({
    data,
    requestId: getRequestId(res),
  } satisfies ApiSuccess<T>);
}

export function noContent(res: Response) {
  return res.status(204).end();
}

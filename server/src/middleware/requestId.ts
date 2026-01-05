import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

const HEADER = "x-request-id";
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[47][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function readRequestId(v: string | string[] | undefined): string | null {
  if (!v) return null;
  const s = (Array.isArray(v) ? v[0] : v).trim();
  if (!s) return null;
  return UUID_RE.test(s) ? s : null;
}

export function requestId(req: Request, res: Response, next: NextFunction) {
  const incoming = readRequestId(req.headers[HEADER]);
  const id = incoming ?? randomUUID();

  req.requestId = id;
  res.setHeader(HEADER, id);
  next();
}

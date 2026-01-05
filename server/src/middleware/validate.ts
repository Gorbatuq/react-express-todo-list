import type { Request, Response, NextFunction } from "express";
import type { ZodTypeAny } from "zod";
import { AppError } from "../errors/AppError";

const makeValidator =
  (schema: ZodTypeAny, prop: "body" | "params" | "query") =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[prop]);

    if (!result.success) {
      const flat = result.error.flatten();
      const fields = Object.fromEntries(
        Object.entries(flat.fieldErrors).map(([k, v]) => [
          k,
          (v ?? []).filter(Boolean) as string[],
        ])
      );

      return next(
        new AppError(400, "VALIDATION_ERROR", "Validation failed", fields)
      );
    }

    // type-safe: assign validated data
    (req as any)[prop] = result.data; // here is the only compromise in express types
    return next();
  };

export const validateBody = (schema: ZodTypeAny) =>
  makeValidator(schema, "body");
export const validateParams = (schema: ZodTypeAny) =>
  makeValidator(schema, "params");
export const validateQuery = (schema: ZodTypeAny) =>
  makeValidator(schema, "query");

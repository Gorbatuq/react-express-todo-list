import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

const makeValidator = (schema: ZodSchema, prop: 'body' | 'params' | 'query', errorLabel: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[prop]);
    if (!result.success) {
      return res.status(400).json({
        message: `Validation error ${errorLabel}`,
        issues: result.error.issues.map((issue) => issue.message),
      });
    }
    req[prop] = result.data;
    next();
  };

export const validateBody = (schema: ZodSchema) => makeValidator(schema, 'body', 'body');
export const validateParams = (schema: ZodSchema) => makeValidator(schema, 'params', 'params');
export const validateQuery = (schema: ZodSchema) => makeValidator(schema, 'query', 'query');


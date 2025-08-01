import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

const makeValidator = (
  schema: ZodSchema,
  prop: 'body' | 'params' | 'query',
  errorLabel: string
) => (req: Request, res: Response, next: NextFunction) => {
  const data = req[prop];
  const result = schema.safeParse(data);

  if (!result.success) {
    console.log("VALIDATION ERROR:");
    console.log("Data:", data);
    console.log("Issues:", result.error.issues);
    console.log("Formatted:", result.error.format());
    console.log("Flattened:", result.error.flatten());

    return res.status(400).json({
      message: `Validation error: ${errorLabel}`,
      issues: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    });
  }

  if (prop === "body" || "query") {
    req[prop] = result.data;
  }

  next();
};

export const validateBody = (schema: ZodSchema) => makeValidator(schema, 'body', 'body');
export const validateParams = (schema: ZodSchema) => makeValidator(schema, 'params', 'params');
export const validateQuery = (schema: ZodSchema) => makeValidator(schema, 'query', 'query');

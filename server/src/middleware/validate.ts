import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Помилка валідації",
        issues: result.error.issues.map((issue) => issue.message),
      });
    }

    req.body = result.data;
    next();
  };

import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validationMiddleware =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse({ body: req.body, query: req.query, params: req.params });
      // attach parsed if desired, but controllers here parse the body directly
      return next();
    } catch (e: any) {
      const issues = e?.issues ? e.issues.map((i: any) => ({ path: i.path, message: i.message })) : undefined;
      return res.status(400).json({ message: "Validation failed", errors: issues });
    }
  };
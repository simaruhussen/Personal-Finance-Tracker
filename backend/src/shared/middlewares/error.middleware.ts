import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const errorMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err }, "unhandled_error");
  const status = err?.status || 500;
  const message = err?.message || "Internal Server Error";
  // in production avoid exposing stack
  const payload: any = { message };
  if (process.env.NODE_ENV !== "production" && err?.stack) payload.stack = err.stack;
  res.status(status).json(payload);
};
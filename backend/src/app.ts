import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { logger } from "./shared/utils/logger";
import userRoutes from "./modules/users/user.routes";
import transactionRoutes from "./modules/transactions/transaction.routes";
import { errorMiddleware } from "./shared/middlewares/error.middleware";
import { apiRateLimiter } from "./shared/middlewares/rateLimiter.middleware";
import { metricsRouter } from "./telemetry/metrics";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "*" }));
app.use(express.json({ limit: "10kb" }));
app.use(apiRateLimiter);

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined", { stream: { write: (s) => logger.info(s.trim()) } }));
}

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/metrics", metricsRouter);

app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

// last: error handler
app.use(errorMiddleware);

export default app;
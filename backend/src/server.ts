import app from "./app";
import { config } from "./config";
import { logger } from "./shared/utils/logger";
import prisma from "./db/prismaClient";

const port = Number(process.env.PORT ?? 4000);

const server = app.listen(port, async () => {
  logger.info(`Server listening on port ${port}`);
  try {
    await prisma.$connect();
    logger.info("Database connected");
  } catch (err) {
    logger.error({ err }, "database_connection_failed");
    process.exit(1);
  }
});

const graceful = async () => {
  logger.info("Shutting down gracefully");
  server.close(async () => {
    try {
      await prisma.$disconnect();
      logger.info("Database disconnected");
    } finally {
      process.exit(0);
    }
  });
};

process.on("SIGINT", graceful);
process.on("SIGTERM", graceful);
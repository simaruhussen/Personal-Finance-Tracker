import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "please-change",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "3600s",
  databaseUrl: process.env.DATABASE_URL || ""
};
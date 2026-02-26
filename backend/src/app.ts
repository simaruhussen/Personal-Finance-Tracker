// app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Swagger
import { setupSwagger } from './swagger.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import transactionRoutes from "./routes/transactions.js";

// Error handler
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// -------------------------
// Security & Middlewares
// -------------------------
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// -------------------------
// Health Check
// -------------------------
app.get('/', (req, res) => {
  res.send('Personal Finance Tracker API is running 🚀');
});

// -------------------------
// Swagger
// -------------------------
setupSwagger(app);

// -------------------------
// Routes
// -------------------------
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// -------------------------
// Error Handling
// -------------------------
app.use(errorHandler);

export default app;
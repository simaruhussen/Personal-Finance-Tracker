// app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Swagger
import { setupSwagger } from './swagger.js';

// Correct relative imports for TS/Node ESM
import { errorHandler } from './middlewares/errorHandler.js';
import { register, login } from './controllers/authController.js';
import { createTransaction, getTransactions, getSummary } from './controllers/transactionController.js';
import { authenticate } from './middlewares/auth.js';

const app = express();

const allowedOrigin = process.env.CORS_ORIGIN;

// -------------------------
// Security & Middlewares
// -------------------------
app.use(helmet());
app.use(cors(allowedOrigin ? { origin: allowedOrigin, credentials: true } : undefined));
app.use(express.json());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// -------------------------
// Health Check Route
// -------------------------
app.get('/', (req, res) => {
  res.send('Personal Finance Tracker API is running 🚀');
});

// -------------------------
// Swagger Setup
// -------------------------
setupSwagger(app);

// -------------------------
// Auth Routes
// -------------------------
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// -------------------------
// Protected Transaction Routes
// -------------------------
app.use('/api/transactions', authenticate);
app.post('/api/transactions', createTransaction);
app.get('/api/transactions', getTransactions);
app.get('/api/summary', authenticate, getSummary);

// -------------------------
// Error Handling
// -------------------------
app.use(errorHandler);

export default app;
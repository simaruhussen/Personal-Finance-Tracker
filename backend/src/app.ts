import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { setupSwagger } from './swagger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { register, login } from './controllers/authController.js';
import { createTransaction, getTransactions, getSummary, updateTransaction, deleteTransaction } from './controllers/transactionController.js';
import { authenticate } from './middlewares/auth.js';

const app = express();
const allowedOrigin = process.env.CORS_ORIGIN;

app.use(helmet());
app.use(cors(allowedOrigin ? { origin: allowedOrigin, credentials: true } : undefined));
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

app.get('/', (req, res) => {
  res.send('Personal Finance Tracker API is running 🚀');
});

setupSwagger(app);

app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// protect transactions routes
app.use('/api/transactions', authenticate);
app.post('/api/transactions', createTransaction);
app.get('/api/transactions', getTransactions);
app.put('/api/transactions/:id', updateTransaction);
app.delete('/api/transactions/:id', deleteTransaction);

app.get('/api/summary', authenticate, getSummary);

app.use(errorHandler);

export default app;
import type { Application, Request, Response } from 'express';
import { register, login } from './controllers/authController.js';
import { createTransaction, getTransactions, getSummary, updateTransaction, deleteTransaction } from './controllers/transactionController.js';
import { authenticate } from './middlewares/auth.js';

export default function setupRoutes(app: Application) {
  // health / root
  app.get('/', (_req: Request, res: Response) => {
    res.send('Personal Finance Tracker API is running 🚀');
  });

  // auth
  app.post('/api/auth/register', register);
  app.post('/api/auth/login', login);

  // protect transactions routes
  app.use('/api/transactions', authenticate);
  app.post('/api/transactions', createTransaction);
  app.get('/api/transactions', getTransactions);
  app.put('/api/transactions/:id', updateTransaction);
  app.delete('/api/transactions/:id', deleteTransaction);

  // summary
  app.get('/api/summary', authenticate, getSummary);
}


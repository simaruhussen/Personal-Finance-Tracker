import { Router } from 'express';
import {
  createTransactionHandler,
  listTransactionsHandler,
  getTransactionHandler,
  updateTransactionHandler,
  deleteTransactionHandler,
  summaryHandler
} from './transaction.controller';

const router = Router();

router.post('/', createTransactionHandler);
router.get('/', listTransactionsHandler);
router.get('/summary', summaryHandler);
router.get('/:id', getTransactionHandler);
router.put('/:id', updateTransactionHandler);
router.delete('/:id', deleteTransactionHandler);

export default router;
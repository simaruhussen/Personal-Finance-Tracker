import { Request, Response } from 'express';
import { createTransactionSchema, updateTransactionSchema } from './dto/transaction.dto';
import * as txService from './transaction.service';

const parseOptionalNumber = (v: any) => {
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
};

export const createTransactionHandler = async (req: Request, res: Response) => {
  const parsed = createTransactionSchema.parse(req.body);
  const userIdHeader = parseOptionalNumber((req as any).user?.id ?? req.body.userId ?? req.query.userId);
  const payload = { ...parsed, userId: parsed.userId ?? userIdHeader };
  if (!payload.userId) return res.status(400).json({ message: 'userId is required' });
  const created = await txService.createTransaction(payload);
  return res.status(201).json({ data: created });
};

export const listTransactionsHandler = async (req: Request, res: Response) => {
  const page = parseOptionalNumber(req.query.page) ?? 1;
  const pageSize = parseOptionalNumber(req.query.pageSize) ?? 20;
  const type = req.query.type === 'income' || req.query.type === 'expense' ? (req.query.type as 'income' | 'expense') : undefined;
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  const start = typeof req.query.start === 'string' ? new Date(req.query.start) : undefined;
  const end = typeof req.query.end === 'string' ? new Date(req.query.end) : undefined;
  const userId = parseOptionalNumber((req as any).user?.id ?? req.query.userId);
  const result = await txService.listTransactions({ page, pageSize, type, category, start, end, userId });
  return res.json({ data: result.data, meta: result.meta });
};

export const getTransactionHandler = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id) || id <= 0) return res.status(400).json({ message: 'invalid id' });
  const tx = await txService.getTransactionById(id);
  if (!tx) return res.status(404).json({ message: 'transaction not found' });
  return res.json({ data: tx });
};

export const updateTransactionHandler = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id) || id <= 0) return res.status(400).json({ message: 'invalid id' });
  const parsed = updateTransactionSchema.parse(req.body);
  const updated = await txService.updateTransaction(id, parsed);
  return res.json({ data: updated });
};

export const deleteTransactionHandler = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id) || id <= 0) return res.status(400).json({ message: 'invalid id' });
  await txService.deleteTransaction(id);
  return res.status(204).send();
};

export const summaryHandler = async (req: Request, res: Response) => {
  const start = typeof req.query.start === 'string' ? new Date(req.query.start) : undefined;
  const end = typeof req.query.end === 'string' ? new Date(req.query.end) : undefined;
  const userId = Number((req as any).user?.id ?? req.query.userId) || undefined;
  const summary = await txService.getSummary(userId, start, end);
  return res.json({ data: summary });
};
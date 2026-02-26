import type { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { transactionSchema } from '../utils/validators.js';

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = transactionSchema.parse(req.body);
    const userId = (req as any).user.userId;
    const transaction = await prisma.transaction.create({
      data: { ...data, userId, date: data.date ? new Date(data.date) : new Date() }
    });
    res.status(201).json(transaction);
  } catch (error) { next(error); }
};

export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    });
    res.json(transactions);
  } catch (error) { next(error); }
};

export const getSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const transactions = await prisma.transaction.findMany({ where: { userId } });
    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryTotals: Record<string, number> = {};
    transactions.forEach(t => {
      const amount = Number(t.amount);
      if (t.type === 'INCOME') totalIncome += amount;
      if (t.type === 'EXPENSE') totalExpenses += amount;
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amount;
    });
    res.json({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      categoryTotals
    });
  } catch (error) { next(error); }
};

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update a transaction (owner only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 250
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *                 example: EXPENSE
 *               category:
 *                 type: string
 *                 example: Groceries
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-02-25
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Transaction not found
 */
export const updateTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Accept id from URL param or request body (some clients may send id in body)
    const id = (req.params && req.params.id) || (req.body && req.body.id);
    // eslint-disable-next-line no-console
    console.log('updateTransaction: resolved id=', id);
    if (!id || typeof id !== 'string') return res.status(400).json({ message: 'Invalid transaction id' });

    const userId = (req as any).user.userId;

    const existing = await prisma.transaction.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Transaction not found' });
    if (existing.userId !== userId) return res.status(403).json({ message: 'Forbidden' });

    const updateSchema = (transactionSchema as any).partial ? (transactionSchema as any).partial() : transactionSchema;
    const data = updateSchema.parse(req.body);

    const updateData: any = {};
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.date !== undefined) updateData.date = data.date ? new Date(data.date) : null;

    const updated = await prisma.transaction.update({
      where: { id },
      data: updateData
    });

    res.json(updated);
  } catch (error) { next(error); }
};

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction (owner only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Transaction not found
 */
export const deleteTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Accept id from URL param or request body (some clients may send id in body)
    const id = (req.params && req.params.id) || (req.body && req.body.id);
    // debug: log incoming id and request info to help diagnose invalid id issues
    // eslint-disable-next-line no-console
    console.log('deleteTransaction called:', { method: req.method, url: req.url, resolvedId: id, params: req.params, headersAuth: req.headers.authorization ? 'present' : 'missing' });
    if (!id || typeof id !== 'string') return res.status(400).json({ message: 'Invalid transaction id' });

    const userId = (req as any).user.userId;

    const existing = await prisma.transaction.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Transaction not found' });
    if (existing.userId !== userId) return res.status(403).json({ message: 'Forbidden' });

    await prisma.transaction.delete({ where: { id } });
    res.json({ message: 'Transaction deleted' });
  } catch (error) { next(error); }
};
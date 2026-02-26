import type { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { transactionSchema } from '../utils/validators.js';

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management endpoints
 */

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - category
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 500
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *                 example: INCOME
 *               category:
 *                 type: string
 *                 example: Salary
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-02-26
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Invalid request data
 */
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

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions for the logged-in user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /api/summary:
 *   get:
 *     summary: Get transaction summary for the logged-in user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transaction summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalIncome:
 *                   type: number
 *                 totalExpenses:
 *                   type: number
 *                 balance:
 *                   type: number
 *                 categoryTotals:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *       401:
 *         description: Unauthorized
 */
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
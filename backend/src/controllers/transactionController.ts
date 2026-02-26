import type { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { transactionSchema } from '../utils/validators.js';

/**
 * Extend Express Request to include authenticated user
 */
interface AuthenticatedRequest extends Request {
  user: { userId: string };
}

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management endpoints
 * 
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         amount:
 *           type: number
 *         type:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *         category:
 *           type: string
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         userId:
 *           type: string
 *     TransactionInput:
 *       type: object
 *       required:
 *         - amount
 *         - type
 *         - category
 *       properties:
 *         amount:
 *           type: number
 *         type:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *         category:
 *           type: string
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/* ======================================================
   CREATE TRANSACTION
====================================================== */

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
 *             $ref: '#/components/schemas/TransactionInput'
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid input
 */
export const createTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = transactionSchema.parse(req.body);

    const transaction = await prisma.transaction.create({
      data: {
        amount: data.amount.toString(),
        type: data.type,
        category: data.category,
        description: data.description ?? null,
        date: data.date ? new Date(data.date) : new Date(),
        userId: req.user.userId
      }
    });

    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   GET TRANSACTIONS
====================================================== */

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions for the authenticated user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */
export const getTransactions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.userId },
      orderBy: { date: 'desc' }
    });

    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   UPDATE TRANSACTION
====================================================== */

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update a transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Transaction UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionInput'
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       404:
 *         description: Transaction not found
 */
export const updateTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactionId = req.params.id;
    const data = transactionSchema.partial().parse(req.body);

    const updateData: any = {};

    if (data.amount !== undefined) updateData.amount = data.amount.toString();
    if (data.type) updateData.type = data.type;
    if (data.category) updateData.category = data.category;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.date) updateData.date = new Date(data.date);

    const result = await prisma.transaction.updateMany({
      where: { id: transactionId, userId: req.user.userId },
      data: updateData
    });

    if (result.count === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction updated successfully" });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   DELETE TRANSACTION
====================================================== */

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Transaction UUID
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       404:
 *         description: Transaction not found
 */
export const deleteTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const existing = await prisma.transaction.findFirst({
      where: { id, userId: req.user.userId }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await prisma.transaction.delete({ where: { id } });

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   GET SUMMARY
====================================================== */

/**
 * @swagger
 * /api/transactions/summary:
 *   get:
 *     summary: Get transaction summary (total income, expenses, balance, category totals)
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
 */
export const getSummary = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.userId }
    });

    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryTotals: Record<string, number> = {};

    for (const t of transactions) {
      const amount = Number(t.amount);
      if (t.type === 'INCOME') totalIncome += amount;
      if (t.type === 'EXPENSE') totalExpenses += amount;
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amount;
    }

    res.json({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      categoryTotals
    });
  } catch (error) {
    next(error);
  }
};
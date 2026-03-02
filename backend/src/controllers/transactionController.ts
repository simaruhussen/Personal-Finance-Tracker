// backend/src/controllers/transactionController.ts
import type { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma.js";
import { transactionSchema } from "../utils/validators.js";

/**
 * Helpers: convert incoming date strings into local start/end Date objects.
 */
function startOfDayLocal(dateStr: string): Date {
  const d = new Date(dateStr);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function endOfDayLocal(dateStr: string): Date {
  const d = new Date(dateStr);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

/**
 * Create a transaction (unchanged, only minor defensive typing)
 */
export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = transactionSchema.parse(req.body);
    const userId = (req as any).user.userId;
    const transaction = await prisma.transaction.create({
      data: { ...data, userId, date: data.date ? new Date(data.date) : new Date() },
    });
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/transactions
 * Optional query params:
 *  - from: ISO date or YYYY-MM-DD string (inclusive start)
 *  - to:   ISO date or YYYY-MM-DD string (inclusive end)
 *  - limit, offset (optional paging)
 */
export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { from, to, limit, offset } = req.query as {
      from?: string;
      to?: string;
      limit?: string;
      offset?: string;
    };

    const where: any = { userId };

    if (from || to) {
      const dateFilter: any = {};
      if (from) {
        dateFilter.gte = startOfDayLocal(from);
      }
      if (to) {
        // If `to` already contains a time (contains 'T'), use it directly; otherwise treat as end-of-day.
        dateFilter.lte = /T/.test(to) ? new Date(to) : endOfDayLocal(to);
      }
      where.date = dateFilter;
    }

    const take = limit ? Math.min(Number(limit), 1000) : undefined;
    const skip = offset ? Math.max(Number(offset), 0) : undefined;

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      ...(take !== undefined ? { take } : {}),
      ...(skip !== undefined ? { skip } : {}),
    });

    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/summary
 * Optional query params:
 *  - from, to as above — summary only uses transactions in the date range when provided
 *
 * Response shape preserved: { totalIncome, totalExpenses, balance, categoryTotals }
 */
export const getSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { from, to } = req.query as { from?: string; to?: string };

    const where: any = { userId };

    if (from || to) {
      const dateFilter: any = {};
      if (from) dateFilter.gte = startOfDayLocal(from);
      if (to) dateFilter.lte = /T/.test(String(to)) ? new Date(String(to)) : endOfDayLocal(String(to));
      where.date = dateFilter;
    }

    // Use prisma aggregation where possible for efficiency
    const incomeAgg = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { ...where, type: "INCOME" },
    });
    const expenseAgg = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { ...where, type: "EXPENSE" },
    });

    const totalIncome = Number(incomeAgg._sum.amount ?? 0);
    const totalExpenses = Number(expenseAgg._sum.amount ?? 0);

    // Category totals: grouping by category
    const groupByCategory = await prisma.transaction.groupBy({
      by: ["category"],
      _sum: { amount: true },
      where,
    });

    const categoryTotals: Record<string, number> = {};
    groupByCategory.forEach((g) => {
      const key = String(g.category ?? "Uncategorized");
      categoryTotals[key] = Number(g._sum.amount ?? 0);
    });

    res.json({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      categoryTotals,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update transaction (kept same logic, but ensure date handling is consistent)
 */
export const updateTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = (req.params && req.params.id) || (req.body && req.body.id);
    console.log("updateTransaction: resolved id=", id);
    if (!id || typeof id !== "string") return res.status(400).json({ message: "Invalid transaction id" });

    const userId = (req as any).user.userId;

    const existing = await prisma.transaction.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Transaction not found" });
    if (existing.userId !== userId) return res.status(403).json({ message: "Forbidden" });

    const updateSchema = (transactionSchema as any).partial ? (transactionSchema as any).partial() : transactionSchema;
    const data = updateSchema.parse(req.body);

    const updateData: any = {};
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.date !== undefined) updateData.date = data.date ? new Date(data.date) : null;

    const updated = await prisma.transaction.update({
      where: { id },
      data: updateData,
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete transaction (unchanged)
 */
export const deleteTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = (req.params && req.params.id) || (req.body && req.body.id);
    console.log("deleteTransaction called:", {
      method: req.method,
      url: req.url,
      resolvedId: id,
      params: req.params,
      headersAuth: req.headers.authorization ? "present" : "missing",
    });
    if (!id || typeof id !== "string") return res.status(400).json({ message: "Invalid transaction id" });

    const userId = (req as any).user.userId;

    const existing = await prisma.transaction.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Transaction not found" });
    if (existing.userId !== userId) return res.status(403).json({ message: "Forbidden" });

    await prisma.transaction.delete({ where: { id } });
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    next(error);
  }
};
import prisma from '../../db/prismaClient';
import { CreateTransactionInput, UpdateTransactionInput } from './dto/transaction.dto';

export const createTransaction = async (data: CreateTransactionInput) => {
  const date = new Date(data.date);
  return prisma.transaction.create({
    data: {
      amount: data.amount,
      type: data.type,
      category: data.category,
      description: data.description ?? null,
      date,
      userId: data.userId ?? undefined
    }
  });
};

export const getTransactionById = async (id: number) => {
  return prisma.transaction.findUnique({ where: { id } });
};

export const updateTransaction = async (id: number, data: UpdateTransactionInput) => {
  const payload: any = {};
  if (data.amount !== undefined) payload.amount = data.amount;
  if (data.type !== undefined) payload.type = data.type;
  if (data.category !== undefined) payload.category = data.category;
  if (data.description !== undefined) payload.description = data.description;
  if (data.date !== undefined) payload.date = new Date(data.date);
  return prisma.transaction.update({ where: { id }, data: payload });
};

export const deleteTransaction = async (id: number) => {
  return prisma.transaction.delete({ where: { id } });
};

export const listTransactions = async (options: {
  userId?: number;
  page?: number;
  pageSize?: number;
  type?: 'income' | 'expense';
  category?: string;
  start?: Date;
  end?: Date;
}) => {
  const page = options.page && options.page > 0 ? options.page : 1;
  const pageSize = options.pageSize && options.pageSize > 0 ? Math.min(options.pageSize, 100) : 20;
  const skip = (page - 1) * pageSize;

  const where: any = {};
  if (options.userId) where.userId = options.userId;
  if (options.type) where.type = options.type;
  if (options.category) where.category = options.category;
  if (options.start || options.end) where.date = {};
  if (options.start) where.date.gte = options.start;
  if (options.end) where.date.lte = options.end;

  const [data, total] = await Promise.all([
    prisma.transaction.findMany({ where, orderBy: { date: 'desc' }, skip, take: pageSize }),
    prisma.transaction.count({ where })
  ]);

  return { data, meta: { page, pageSize, total } };
};

export const getSummary = async (userId?: number, start?: Date, end?: Date) => {
  const baseWhere: any = {};
  if (userId) baseWhere.userId = userId;
  if (start || end) baseWhere.date = {};
  if (start) baseWhere.date.gte = start;
  if (end) baseWhere.date.lte = end;

  const incomeAgg = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { ...baseWhere, type: 'income' }
  });

  const expenseAgg = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { ...baseWhere, type: 'expense' }
  });

  const byCategory = await prisma.transaction.groupBy({
    by: ['category', 'type'],
    where: baseWhere,
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } }
  });

  const totalIncome = incomeAgg._sum.amount ?? 0;
  const totalExpense = expenseAgg._sum.amount ?? 0;
  const balance = totalIncome - totalExpense;

  return { totalIncome, totalExpense, balance, byCategory };
};
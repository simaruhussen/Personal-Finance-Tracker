import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(1).max(80),
  email: z.string().email(),
  password: z.string().min(6)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const transactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1),
  description: z.string().optional(),
  date: z.string().datetime().optional() // ISO string
});
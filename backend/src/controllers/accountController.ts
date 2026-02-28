import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';

const accountInputSchema = z.object({
  name: z.string().min(1).max(50),
  balance: z.number().nonnegative()
});

const upsertAccountsSchema = z.object({
  accounts: z.array(accountInputSchema)
});

const DEFAULT_ACCOUNT_NAMES = ['Checking Account', 'Savings', 'Cash'] as const;

export const getAccounts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId as string;

    let accounts = await prisma.account.findMany({
      where: { userId },
      orderBy: { name: 'asc' }
    });

    // If user has no accounts yet, seed with defaults at 0 balance
    if (accounts.length === 0) {
      accounts = await Promise.all(
        DEFAULT_ACCOUNT_NAMES.map((name) =>
          prisma.account.create({
            data: { userId, name, balance: 0 }
          })
        )
      );
    }

    res.json(accounts);
  } catch (error) {
    next(error);
  }
};

export const upsertAccounts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId as string;
    const { accounts } = upsertAccountsSchema.parse(req.body);

    const updated = await Promise.all(
      accounts.map((acc) =>
        prisma.account.upsert({
          where: { userId_name: { userId, name: acc.name } },
          create: {
            userId,
            name: acc.name,
            balance: acc.balance
          },
          update: {
            balance: acc.balance
          }
        })
      )
    );

    res.json(updated);
  } catch (error) {
    next(error);
  }
};


// src/lib/types.ts
export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // ISO timestamp
  description?: string;
};
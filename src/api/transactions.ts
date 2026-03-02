// src/api/transactions.ts
import { http } from "./http";

export type ApiTransactionType = "INCOME" | "EXPENSE";

export type ApiTransaction = {
  id: string;
  amount: number | string;
  type: ApiTransactionType;
  category: string;
  description?: string | null;
  date: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateTransactionRequest = {
  amount: number;
  type: ApiTransactionType;
  category: string;
  description?: string;
  date?: string;
};

export type ListTransactionsParams = {
  from?: string | null;
  to?: string | null;
  limit?: number;
  offset?: number;
};

export async function listTransactions(params?: ListTransactionsParams): Promise<ApiTransaction[]> {
  const query: Record<string, string | number> = {};
  if (params?.from) query.from = params.from;
  if (params?.to) query.to = params.to;
  if (typeof params?.limit === "number") query.limit = params.limit;
  if (typeof params?.offset === "number") query.offset = params.offset;

  const res = await http.get<ApiTransaction[]>("/api/transactions", {
    params: Object.keys(query).length ? query : undefined,
  });
  return res.data;
}

export async function createTransaction(payload: CreateTransactionRequest): Promise<ApiTransaction> {
  const res = await http.post<ApiTransaction>("/api/transactions", payload);
  return res.data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await http.delete(`/api/transactions/${encodeURIComponent(id)}`);
}

export async function updateTransaction(id: string, payload: CreateTransactionRequest): Promise<ApiTransaction> {
  const res = await http.put<ApiTransaction>(`/api/transactions/${encodeURIComponent(id)}`, payload);
  return res.data;
}
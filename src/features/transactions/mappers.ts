import type { ApiTransaction, CreateTransactionRequest } from "../../api/transactions";
import type { Transaction } from "./types";

export function apiToUiTransaction(api: ApiTransaction): Transaction {
  const rawAmount = typeof api.amount === "string" ? Number(api.amount) : api.amount;
  const positive = Number.isFinite(rawAmount) ? Math.abs(rawAmount) : 0;

  const type = api.type === "INCOME" ? "income" : "expense";
  const signedAmount = type === "income" ? positive : -positive;

  return {
    id: api.id,
    amount: signedAmount,
    type,
    category: api.category,
    description: api.description ?? undefined,
    date: new Date(api.date).toISOString(),
  };
}

export type UiCreateTransactionInput = Omit<Transaction, "id"> & { id?: string };

export function uiToCreateRequest(ui: UiCreateTransactionInput): CreateTransactionRequest {
  const positive = Math.abs(Number(ui.amount) || 0);
  return {
    amount: positive,
    type: ui.type === "income" ? "INCOME" : "EXPENSE",
    category: ui.category,
    description: ui.description,
    date: ui.date,
  };
}


// src/features/transactions/queries.ts
import { useQuery } from "@tanstack/react-query";
import { listTransactions, type ListTransactionsParams } from "../../api/transactions";
import { getSummary, type SummaryResponse } from "../../api/summary";
import { getErrorMessage } from "../../api/errors";
import { apiToUiTransaction } from "./mappers";
import type { Transaction } from "./types";

export const TRANSACTIONS_KEY = ["transactions"];
export const SUMMARY_KEY = ["summary"];

export type DateRange = { from: string | null; to: string | null };

/**
 * Helper to produce stable react-query keys for a given dateRange
 */
function transactionsKey(dateRange?: DateRange) {
  return [TRANSACTIONS_KEY[0], dateRange?.from ?? "all", dateRange?.to ?? "all"];
}
function summaryKey(dateRange?: DateRange) {
  return [SUMMARY_KEY[0], dateRange?.from ?? "all", dateRange?.to ?? "all"];
}

/**
 * useTransactionsQuery(dateRange?)
 * - dateRange: optional { from: string|null, to: string|null }
 * - options: forwarded to useQuery
 */
export function useTransactionsQuery(dateRange?: DateRange, options?: any) {
  const params: ListTransactionsParams | undefined = dateRange
    ? { from: dateRange.from ?? undefined, to: dateRange.to ?? undefined }
    : undefined;

  return useQuery<Transaction[], Error>({
    queryKey: transactionsKey(dateRange),
    queryFn: async () => {
      const apiList = await listTransactions(params);
      return apiList.map(apiToUiTransaction);
    },
    ...options,
  });
}

/**
 * useSummaryQuery(dateRange?)
 * - returns SummaryResponse from src/api/summary
 */
export function useSummaryQuery(dateRange?: DateRange, options?: any) {
  const params = dateRange ? { from: dateRange.from ?? undefined, to: dateRange.to ?? undefined } : undefined;

  return useQuery<SummaryResponse, Error>({
    queryKey: summaryKey(dateRange),
    queryFn: async () => getSummary(params),
    ...options,
  });
}

/**
 * Map query error to user-friendly message
 */
export function queryErrorToMessage(error: unknown): string {
  return getErrorMessage(error);
}
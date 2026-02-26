import { useQuery } from "@tanstack/react-query";
import { listTransactions } from "../../api/transactions";
import { getSummary } from "../../api/summary";
import { getErrorMessage } from "../../api/errors";
import { apiToUiTransaction } from "./mappers";
import type { Transaction } from "./types";
import type { SummaryResponse } from "../../api/summary";

export const TRANSACTIONS_KEY = ["transactions"];
export const SUMMARY_KEY = ["summary"];

export function useTransactionsQuery() {
  return useQuery<Transaction[], Error>({
    queryKey: TRANSACTIONS_KEY,
    queryFn: async () => {
      const apiList = await listTransactions();
      return apiList.map(apiToUiTransaction);
    },
  });
}

export function useSummaryQuery() {
  return useQuery<SummaryResponse, Error>({
    queryKey: SUMMARY_KEY,
    queryFn: getSummary,
  });
}

export function queryErrorToMessage(error: unknown): string {
  return getErrorMessage(error);
}


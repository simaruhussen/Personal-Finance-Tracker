// src/features/accounts/queries.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAccounts, upsertAccounts, type ApiAccount, type UpsertAccountInput } from "../../api/accounts";
import { getErrorMessage } from "../../api/errors";

export const ACCOUNTS_KEY = ["accounts"];

export function useAccountsQuery() {
  return useQuery<ApiAccount[], Error>({
    queryKey: ACCOUNTS_KEY,
    queryFn: getAccounts,
  });
}

export function useUpsertAccountsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accounts: UpsertAccountInput[]) => {
      return await upsertAccounts({ accounts });
    },
    onSuccess: () => {
      // Invalidate accounts query so components reading accounts (e.g. Sidebar) refresh
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY });
    },
  });
}

/**
 * Helpers to present friendly messages to UI components.
 * Delegates to centralized api/errors helper so messaging is consistent across the app.
 */
export function queryErrorToMessage(error: unknown): string {
  return getErrorMessage(error);
}

export function mutationErrorToMessage(error: unknown): string {
  return getErrorMessage(error);
}
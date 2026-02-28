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
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY });
    },
  });
}

export function queryErrorToMessage(error: unknown): string {
  return getErrorMessage(error);
}

export function mutationErrorToMessage(error: unknown): string {
  return getErrorMessage(error);
}


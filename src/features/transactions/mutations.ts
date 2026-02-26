import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction } from "../../api/transactions";
import { getErrorMessage } from "../../api/errors";
import { SUMMARY_KEY, TRANSACTIONS_KEY } from "./queries";
import { uiToCreateRequest, type UiCreateTransactionInput } from "./mappers";

export function useCreateTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UiCreateTransactionInput) => {
      const payload = uiToCreateRequest(input);
      return await createTransaction(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: SUMMARY_KEY });
    },
  });
}

export function mutationErrorToMessage(error: unknown): string {
  return getErrorMessage(error);
}


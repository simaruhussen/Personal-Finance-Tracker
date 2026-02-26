import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction } from "../../api/transactions";
import { getErrorMessage } from "../../api/errors";
import { SUMMARY_KEY, TRANSACTIONS_KEY } from "./queries";
import { uiToCreateRequest, type UiCreateTransactionInput } from "./mappers";
import { http } from "../../api/http";
import type { Transaction } from "./types";

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

export function useDeleteTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await http.delete(`/api/transactions/${encodeURIComponent(id)}`);
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: TRANSACTIONS_KEY });
      const previous = queryClient.getQueryData<Transaction[] | undefined>(TRANSACTIONS_KEY);
      queryClient.setQueryData<Transaction[] | undefined>(TRANSACTIONS_KEY, (prev) =>
        prev ? prev.filter((t) => t.id !== id) : prev,
      );
      return { previous };
    },
    onError: (_err, _id, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(TRANSACTIONS_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: SUMMARY_KEY });
    },
  });
}

export function useUpdateTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UiCreateTransactionInput }) => {
      const payload = uiToCreateRequest(input);
      const res = await http.put(`/api/transactions/${encodeURIComponent(id)}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: SUMMARY_KEY });
    },
  });
}


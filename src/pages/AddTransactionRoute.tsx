import React, { useMemo } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import AddTransaction from "./AddTransaction";
import type { DashboardOutletContext } from "./Dashboard";
import type { Transaction } from "../lib/types";
import { useTransactionsQuery } from "../features/transactions/queries";
import { useCreateTransactionMutation, useUpdateTransactionMutation, mutationErrorToMessage } from "../features/transactions/mutations";
import QueryErrorState from "../components/ui/QueryErrorState";

type LocationState = {
  editId?: string;
} | null;

export default function AddTransactionRoute() {
  const { currentUser } = useOutletContext<DashboardOutletContext>();
  const { data: transactions = [] } = useTransactionsQuery();
  const createMutation = useCreateTransactionMutation();
  const updateMutation = useUpdateTransactionMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? null) as LocationState;

  const initial = useMemo(() => {
    const editId = state?.editId;
    if (!editId) return null;
    return transactions.find((t) => t.id === editId) ?? null;
  }, [state?.editId, transactions]);

  const handleSave = (payload: Omit<Transaction, "id"> & { id?: string }) => {
    if (payload.id) {
      updateMutation
        .mutateAsync({ id: payload.id, input: payload })
        .then(() => navigate("/transactions"))
        .catch(() => {});
    } else {
      createMutation
        .mutateAsync(payload)
        .then(() => navigate("/transactions"))
        .catch(() => {});
    }
  };

  const saveError = createMutation.error ?? updateMutation.error;

  if (!currentUser) return null;

  return (
    <>
      {saveError && (
        <div style={{ marginBottom: 8 }}>
          <QueryErrorState message={mutationErrorToMessage(saveError)} />
        </div>
      )}
      <AddTransaction
        onSave={handleSave}
        onCancel={() => navigate("/transactions")}
        initial={initial}
      />
    </>
  );
}


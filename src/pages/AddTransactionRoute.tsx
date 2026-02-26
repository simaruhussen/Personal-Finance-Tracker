import React, { useMemo } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import AddTransaction from "./AddTransaction";
import type { DashboardOutletContext } from "./Dashboard";
import type { Transaction } from "../lib/types";
import { useTransactionsQuery } from "../features/transactions/queries";
import { useCreateTransactionMutation, mutationErrorToMessage } from "../features/transactions/mutations";

type LocationState = {
  editId?: string;
} | null;

export default function AddTransactionRoute() {
  const { currentUser } = useOutletContext<DashboardOutletContext>();
  const { data: transactions = [] } = useTransactionsQuery();
  const createMutation = useCreateTransactionMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? null) as LocationState;

  const initial = useMemo(() => {
    const editId = state?.editId;
    if (!editId) return null;
    return transactions.find((t) => t.id === editId) ?? null;
  }, [state?.editId, transactions]);

  const handleSave = (payload: Omit<Transaction, "id"> & { id?: string }) => {
    // For now, only create is persisted; edits are not supported by the API.
    createMutation
      .mutateAsync(payload)
      .then(() => navigate("/transactions"))
      .catch(() => {
        // errors are surfaced via mutationErrorToMessage below
      });
  };

  if (!currentUser) return null;

  return (
    <>
      {createMutation.error && (
        <div style={{ color: "#b91c1c", fontSize: 13, marginBottom: 8 }}>
          {mutationErrorToMessage(createMutation.error)}
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


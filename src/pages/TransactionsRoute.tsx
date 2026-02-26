import React, { useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import TransactionsList from "./TransactionsList";
import type { DashboardOutletContext } from "./Dashboard";
import type { Transaction } from "../lib/types";
import { useTransactionsQuery, TRANSACTIONS_KEY, queryErrorToMessage } from "../features/transactions/queries";

export default function TransactionsRoute() {
  const { currentUser } = useOutletContext<DashboardOutletContext>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useTransactionsQuery();

  const handleDelete = useCallback(
    (id: string) => {
      if (!confirm("Delete this transaction?")) return;
      queryClient.setQueryData<Transaction[] | undefined>(TRANSACTIONS_KEY, (prev) =>
        prev ? prev.filter((t) => t.id !== id) : prev,
      );
    },
    [queryClient]
  );

  const handleEdit = useCallback(
    (tx: Transaction) => {
      navigate("/transactions/new", { state: { editId: tx.id } });
    },
    [navigate]
  );

  const handleDetail = useCallback(
    (tx: Transaction) => {
      navigate(`/transactions/${encodeURIComponent(tx.id)}`);
    },
    [navigate]
  );

  if (!currentUser) return null;

  if (isLoading) {
    return (
      <div className="card" style={{ padding: 18 }}>
        <div style={{ color: "rgba(var(--accent-rgb),0.7)" }}>Loading transactions…</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card" style={{ padding: 18 }}>
        <div style={{ color: "#b91c1c" }}>{queryErrorToMessage(error)}</div>
        <button className="auth-ghost" style={{ marginTop: 10 }} onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  const transactions = data ?? [];

  return (
    <TransactionsList
      transactions={transactions}
      onDetail={handleDetail}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}


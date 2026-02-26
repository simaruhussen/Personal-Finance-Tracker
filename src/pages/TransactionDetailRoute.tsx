import React, { useMemo } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import TransactionDetail from "./TransactionDetail";
import type { DashboardOutletContext } from "./Dashboard";
import { useTransactionsQuery, queryErrorToMessage } from "../features/transactions/queries";

export default function TransactionDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useOutletContext<DashboardOutletContext>();
  const navigate = useNavigate();
  const { data: transactions = [], isLoading, isError, error, refetch } = useTransactionsQuery();

  const tx = useMemo(() => {
    if (!id) return null;
    return transactions.find((t) => t.id === id) ?? null;
  }, [id, transactions]);

  if (!currentUser) return null;

  if (!id) {
    return (
      <div className="card" style={{ padding: 18 }}>
        <div style={{ color: "rgba(var(--accent-rgb),0.8)" }}>Missing transaction id.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="card" style={{ padding: 18 }}>
        <div style={{ color: "rgba(var(--accent-rgb),0.7)" }}>Loading transaction…</div>
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

  if (!tx) {
    return (
      <div className="card" style={{ padding: 18 }}>
        <div style={{ color: "rgba(var(--accent-rgb),0.8)" }}>Transaction not found.</div>
        <div style={{ marginTop: 10 }}>
          <button className="auth-ghost" onClick={() => navigate("/transactions")}>Back to list</button>
        </div>
      </div>
    );
  }

  return <TransactionDetail tx={tx} onBack={() => navigate("/transactions")} />;
}



// src/components/cards/RecentTransactionsCard.tsx
import React, { useMemo } from "react";
import { useDateRange } from "../../features/dashboard/DateRangeContext";
import { useTransactionsQuery } from "../../features/transactions/queries";
import QueryLoadingState from "../ui/QueryLoadingState";
import QueryErrorState from "../ui/QueryErrorState";
import QueryEmptyState from "../ui/QueryEmptyState";

export default function RecentTransactionsCard() {
  const { range } = useDateRange();
  const { data = [], isLoading, isError, error, refetch } = useTransactionsQuery(range);

  const recent = useMemo(() => data.slice(0, 5), [data]);

  return (
    <div className="card">
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, marginBottom: 8, color: "rgb(var(--accent-rgb))" }}>
        Recent Transactions
      </h3>

      {isLoading && <QueryLoadingState />}

      {isError && <QueryErrorState message={String(error?.message ?? "Failed to load transactions")} onRetry={() => refetch()} />}

      {!isLoading && !isError && recent.length === 0 && <QueryEmptyState message="No transactions yet." />}

      {!isLoading && !isError && recent.length > 0 && (
        <div style={{ display: "grid", gap: 8 }}>
          {recent.map((t) => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ width: 90, color: "rgba(var(--accent-rgb), 0.7)" }}>{new Date(t.date).toLocaleDateString()}</div>
              <div style={{ flex: 1, color: "rgb(var(--accent-rgb))" }}>{t.category}</div>
              <div style={{ width: 90, textAlign: "right", fontWeight: 700, color: "rgb(var(--accent-rgb))" }}>
                {t.amount >= 0 ? `birr ${Math.abs(t.amount).toLocaleString()}` : `birr ${Math.abs(t.amount).toLocaleString()}`}
              </div>
              <div style={{ marginLeft: 12 }}>
                <span
                  className="chip"
                  style={{
                    background: "rgba(var(--secondary-rgb),0.08)",
                    color: "rgb(var(--secondary-rgb))",
                    textTransform: "capitalize",
                  }}
                >
                  {t.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
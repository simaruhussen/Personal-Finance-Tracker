// src/components/cards/OverviewCard.tsx
import React from "react";
import { useDateRange } from "../../features/dashboard/DateRangeContext";
import { useSummaryQuery } from "../../features/transactions/queries";
import QueryLoadingState from "../ui/QueryLoadingState";
import QueryErrorState from "../ui/QueryErrorState";

export default function OverviewCard() {
  const { range } = useDateRange();
  const { data, isLoading, isError, error, refetch } = useSummaryQuery(range);

  const totalIncome = data?.totalIncome ?? 0;
  const totalExpenses = data?.totalExpenses ?? 0;
  const balance = data?.balance ?? 0;

  return (
    <div className="card" style={{ padding: 18 }}>
      <h3
        style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 12,
          color: "rgb(var(--accent-rgb))",
        }}
      >
        Income &amp; Expenses
      </h3>

      {isLoading && (
        <div
          style={{
            height: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <QueryLoadingState message="Loading summary…" />
        </div>
      )}

      {isError && <QueryErrorState message={String(error?.message ?? "Failed to load summary")} onRetry={() => refetch()} />}

      {!isLoading && !isError && (
        <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "rgba(var(--accent-rgb),0.75)" }}>Income</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: "rgb(var(--secondary-rgb))" }}>
              {Number(totalIncome).toLocaleString()} birr
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "rgba(var(--accent-rgb),0.75)" }}>Expenses</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: "rgba(255,80,80,1)" }}>
              {Number(totalExpenses).toLocaleString()} birr
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "rgba(var(--accent-rgb),0.75)" }}>Balance</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: "rgb(var(--accent-rgb))" }}>
              {Number(balance).toLocaleString()} birr
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
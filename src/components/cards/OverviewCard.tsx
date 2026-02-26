import React from "react";
import { useSummaryQuery, queryErrorToMessage } from "../../features/transactions/queries";

export default function OverviewCard() {
  const { data, isLoading, isError, error } = useSummaryQuery();

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
            color: "rgba(var(--accent-rgb),0.45)",
            fontSize: 13,
          }}
        >
          Loading summary…
        </div>
      )}

      {isError && (
        <div style={{ color: "#b91c1c", fontSize: 13 }}>
          {queryErrorToMessage(error)}
        </div>
      )}

      {!isLoading && !isError && (
        <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "rgba(var(--accent-rgb),0.75)" }}>Income</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: "rgb(var(--secondary-rgb))" }}>
              ${totalIncome.toLocaleString()}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "rgba(var(--accent-rgb),0.75)" }}>Expenses</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: "rgba(255,80,80,1)" }}>
              ${totalExpenses.toLocaleString()}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "rgba(var(--accent-rgb),0.75)" }}>Balance</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: "rgb(var(--accent-rgb))" }}>
              ${balance.toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

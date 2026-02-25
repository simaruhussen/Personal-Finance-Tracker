import React from "react";

const sample = [
  { date: "2025-06-01T08:00:00.000Z", amt: 500, category: "Groceries", type: "income" },
  { date: "2025-06-02T10:30:00.000Z", amt: -50, category: "Groceries", type: "expense" },
];

export default function RecentTransactionsCard() {
  return (
    <div className="card">
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, marginBottom: 8, color: "rgb(var(--accent-rgb))" }}>Recent Transactions</h3>
      <div style={{ display: "grid", gap: 8 }}>
        {sample.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ width: 90, color: "rgba(var(--accent-rgb), 0.7)" }}>{new Date(t.date).toLocaleDateString()}</div>
            <div style={{ flex: 1, color: "rgb(var(--accent-rgb))" }}>{t.category}</div>
            <div style={{ width: 90, textAlign: "right", fontWeight: 700, color: "rgb(var(--accent-rgb))" }}>{t.amt >= 0 ? `+$${t.amt}` : `-$${Math.abs(t.amt)}`}</div>
            <div style={{ marginLeft: 12 }}>
              <span className="chip" style={{ background: "rgba(var(--secondary-rgb),0.08)", color: "rgb(var(--secondary-rgb))" }}>{t.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
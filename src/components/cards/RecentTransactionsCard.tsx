import React, { type JSX } from "react";

const sample = [
  { date: "01/12/23", amt: 500, category: "Groceries", type: "income" },
  { date: "02/12/23", amt: -200, category: "Utilities", type: "expense" },
  { date: "03/12/23", amt: -150, category: "Salary", type: "income" },
  { date: "04/12/23", amt: 1000, category: "Freelance", type: "income" },
  { date: "05/12/23", amt: -300, category: "Rent", type: "expense" },
];

export default function RecentTransactionsCard(): JSX.Element {
  return (
    <div className="card card-big" style={{ padding: 16 }}>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Recent Transactions</h3>
      <div style={{ display: "grid", gap: 8 }}>
        {sample.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ width: 80, color: "rgba(0,0,0,0.55)" }}>{t.date}</div>
            <div style={{ flex: 1 }}>{t.category}</div>
            <div style={{ width: 90, textAlign: "right", fontWeight: 700 }}>
              {t.amt >= 0 ? `+$${t.amt}` : `-$${Math.abs(t.amt)}`}
            </div>
            <div style={{ marginLeft: 12 }}>
              <span className="chip">{t.type === "income" ? "Income" : "Expense"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
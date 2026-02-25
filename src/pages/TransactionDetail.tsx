// src/pages/TransactionDetail.tsx
import React from "react";
import type { Transaction } from "../lib/types";

type Props = {
  tx: Transaction;
  onBack: () => void;
};

export default function TransactionDetail({ tx, onBack }: Props) {
  return (
    <div>
      <button onClick={onBack} className="auth-ghost" style={{ marginBottom: 12 }}>Back</button>

      <div className="card" style={{ padding: 18, maxWidth: 920 }}>
        <h3 style={{ marginTop: 0, color: "rgb(var(--accent-rgb))" }}>Transaction Detail</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <strong>Amount</strong>
            <div style={{ marginTop: 6 }}>{Math.abs(tx.amount).toLocaleString()}</div>
          </div>

          <div>
            <strong>Type</strong>
            <div style={{ marginTop: 6 }}>{tx.type}</div>
          </div>

          <div>
            <strong>Category</strong>
            <div style={{ marginTop: 6 }}>{tx.category}</div>
          </div>

          <div>
            <strong>Date</strong>
            <div style={{ marginTop: 6 }}>{new Date(tx.date).toLocaleString()}</div>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <strong>Description</strong>
            <div style={{ marginTop: 6, color: "rgba(var(--accent-rgb), 0.9)" }}>{tx.description || "—"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
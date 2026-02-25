// src/pages/TransactionsList.tsx
import React from "react";
import type { Transaction } from "../lib/types";
import { FaRegTrashAlt, FaRegEdit, FaInfoCircle } from "react-icons/fa";

type Props = {
  transactions: Transaction[];
  onDetail: (tx: Transaction) => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
};

export default function TransactionsList({ transactions, onDetail, onEdit, onDelete }: Props) {
  return (
    <div>
      <h2 style={{ fontSize: 22, marginBottom: 12, color: "rgb(var(--accent-rgb))" }}>Transaction List</h2>

      <div className="card" style={{ padding: 0, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
          <thead style={{ background: "rgb(var(--primary-rgb))", color: "#fff" }}>
            <tr>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>Amount</th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>Type</th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>Category</th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>Date</th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                <td style={{ padding: "18px 16px", color: "rgb(var(--accent-rgb))", fontWeight: 700 }}>{Math.abs(tx.amount).toLocaleString()}</td>
                <td style={{ padding: "18px 16px", color: tx.type === "income" ? "rgb(var(--secondary-rgb))" : "rgba(255,80,80,1)" }}>{tx.type}</td>
                <td style={{ padding: "18px 16px", color: "rgb(var(--accent-rgb))" }}>{tx.category}</td>
                <td style={{ padding: "18px 16px", color: "rgba(var(--accent-rgb),0.8)" }}>{new Date(tx.date).toLocaleString()}</td>
                <td style={{ padding: "18px 16px", display: "flex", gap: 8 }}>
                  <button title="Detail" onClick={() => onDetail(tx)} style={{ border: "none", background: "transparent", cursor: "pointer" }}><FaInfoCircle color="rgb(var(--accent-rgb))" /></button>
                  <button title="Edit" onClick={() => onEdit(tx)} style={{ border: "none", background: "transparent", cursor: "pointer" }}><FaRegEdit color="rgb(var(--accent-rgb))" /></button>
                  <button title="Delete" onClick={() => onDelete(tx.id)} style={{ border: "none", background: "transparent", cursor: "pointer" }}><FaRegTrashAlt color="rgba(255,60,60,0.9)" /></button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 24, textAlign: "center", color: "rgba(var(--accent-rgb),0.7)" }}>No transactions yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
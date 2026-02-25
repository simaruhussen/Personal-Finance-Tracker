// src/pages/AddTransaction.tsx
import React from "react";
import { useForm } from "react-hook-form";
import type { Transaction } from "../lib/types";

type Props = {
  onSave: (tx: Omit<Transaction, "id"> & { id?: string }) => void;
  onCancel: () => void;
  initial?: Transaction | null;
};

type FormValues = {
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  description?: string;
};

export default function AddTransaction({ onSave, onCancel, initial }: Props) {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: initial
      ? { amount: Math.abs(initial.amount), type: initial.type, category: initial.category, date: initial.date.slice(0,16), description: initial.description }
      : { amount: 0, type: "expense", category: "", date: new Date().toISOString().slice(0,16), description: "" },
  });

  const submit = (data: FormValues) => {
    const amt = data.type === "income" ? Math.abs(Number(data.amount)) : -Math.abs(Number(data.amount));
    onSave({ id: initial?.id, amount: amt, type: data.type, category: data.category, date: new Date(data.date).toISOString(), description: data.description });
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, marginBottom: 12, color: "rgb(var(--accent-rgb))" }}>{initial ? "Edit Transaction" : "Add Transaction"}</h2>

      <div className="card" style={{ padding: 18, maxWidth: 920 }}>
        <form onSubmit={handleSubmit(submit)} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ display: "block", marginBottom: 6, color: "rgb(var(--accent-rgb))" }}>Amount</label>
            <input className="auth-input" {...register("amount", { valueAsNumber: true })} type="number" />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6, color: "rgb(var(--accent-rgb))" }}>Type</label>
            <select className="auth-input" {...register("type")}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6, color: "rgb(var(--accent-rgb))" }}>Category</label>
            <input className="auth-input" {...register("category")} />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6, color: "rgb(var(--accent-rgb))" }}>Date & time</label>
            <input className="auth-input" {...register("date")} type="datetime-local" />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", marginBottom: 6, color: "rgb(var(--accent-rgb))" }}>Description</label>
            <textarea className="auth-input" {...register("description")} rows={3} />
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6 }}>
            <button type="button" className="auth-ghost" onClick={onCancel}>Cancel</button>
            <button type="submit" className="auth-btn">{initial ? "Save changes" : "Add transaction"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
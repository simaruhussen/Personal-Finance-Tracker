// src/pages/AddTransaction.tsx
import React, { useState } from "react";
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<FormValues>({
    defaultValues: initial
      ? {
          amount: Math.abs(initial.amount),
          type: initial.type,
          category: initial.category,
          date: initial.date.slice(0, 16),
          description: initial.description ?? "",
        }
      : { amount: 0, type: "expense", category: "", date: new Date().toISOString().slice(0, 16), description: "" },
  });

  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Called when form is valid
  const onValid = (data: FormValues) => {
    const amt = data.type === "income" ? Math.abs(Number(data.amount)) : -Math.abs(Number(data.amount));
    onSave({
      id: initial?.id,
      amount: amt,
      type: data.type,
      category: data.category,
      date: new Date(data.date).toISOString(),
      description: data.description,
    });
  };

  // Called when form invalid
  const onInvalid = (errs: any) => {
    setSubmitAttempted(true);
    const firstKey = Object.keys(errs)[0] as keyof FormValues | undefined;
    if (firstKey) {
      setFocus(firstKey as any);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, marginBottom: 12, color: "rgb(var(--accent-rgb))" }}>
        {initial ? "Edit Transaction" : "Add Transaction"}
      </h2>

      <div className="card" style={{ padding: 18, maxWidth: 920 }}>
        {/* Local styles (move into your CSS if you prefer) */}
        <style>{`
          .auth-input {
            width: 100%;
            padding: 10px 12px;
            font-size: 15px;
            border-radius: 8px;
            border: 1px solid rgba(var(--accent-rgb), 0.12);
            background: #fff;
            box-shadow: 0 1px 2px rgba(16,24,40,0.03);
            transition: box-shadow 150ms ease, border-color 150ms ease;
            color: #0f172a;
            outline: none;
          }

          .auth-input::placeholder {
            color: rgba(15,23,42,0.45);
            font-style: italic;
          }

          .auth-input:focus {
            border-color: rgb(var(--accent-rgb));
            box-shadow: 0 8px 20px rgba(var(--accent-rgb), 0.06);
          }

          .auth-input.error {
            border-color: #dc2626 !important;
            box-shadow: 0 6px 18px rgba(220,38,38,0.06);
          }

          .auth-textarea { min-height: 96px; resize: vertical; }

          .field-error {
            color: #b91c1c;
            font-size: 13px;
            margin-top: 6px;
          }

          .form-error-banner {
            background: #fff1f2;
            color: #991b1b;
            padding: 10px 12px;
            border-radius: 8px;
            border: 1px solid rgba(220,38,38,0.08);
            margin-bottom: 10px;
            font-size: 14px;
          }

          /* Keep your original .auth-btn styling intact — do not override background or text color */
          .auth-btn {
            /* intentionally left blank to preserve original button color and styles */
          }

          .auth-ghost {
            padding: 10px 14px;
            border-radius: 8px;
            border: 1px solid rgba(15,23,42,0.06);
            background: transparent;
            color: rgba(15,23,42,0.9);
            cursor: pointer;
          }

          @media (max-width: 720px) {
            .tx-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* show a concise banner when user attempted submit and there are errors */}
        {submitAttempted && Object.keys(errors).length > 0 && (
          <div className="form-error-banner" role="alert">
            Please fix the highlighted fields before submitting.
          </div>
        )}

        <form
          onSubmit={handleSubmit(onValid, onInvalid)}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          className="tx-grid"
          noValidate
        >
          <div>
            <label style={{ display: "block", marginBottom: 6, color: "rgb(var(--accent-rgb))" }}>Amount</label>
            <input
              className={`auth-input ${errors.amount ? "error" : ""}`}
              {...register("amount", {
                valueAsNumber: true,
                required: "Amount is required",
                validate: (v) => {
                  if (typeof v !== "number" || Number.isNaN(v)) return "Amount must be a number";
                  if (v <= 0) return "Amount must be greater than 0";
                  return true;
                },
              })}
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              aria-invalid={errors.amount ? "true" : "false"}
              aria-describedby={errors.amount ? "amount-error" : undefined}
              inputMode="decimal"
            />
            {errors.amount && (
              <p id="amount-error" className="field-error" role="alert">
                {String(errors.amount.message)}
              </p>
            )}
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6, color: "rgb(var(--accent-rgb))" }}>Type</label>
            <select
              className={`auth-input ${errors.type ? "error" : ""}`}
              {...register("type", { required: "Type is required" })}
              aria-invalid={errors.type ? "true" : "false"}
              aria-describedby={errors.type ? "type-error" : undefined}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            {errors.type && (
              <p id="type-error" className="field-error" role="alert">
                {String(errors.type.message)}
              </p>
            )}
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6, color: "rgb(var(--accent-rgb))" }}>Category</label>
            <input
              className={`auth-input ${errors.category ? "error" : ""}`}
              {...register("category", {
                required: "Category is required",
                minLength: { value: 2, message: "Category is too short" },
              })}
              placeholder="e.g., Groceries, Salary, Utilities"
              aria-invalid={errors.category ? "true" : "false"}
              aria-describedby={errors.category ? "category-error" : undefined}
            />
            {errors.category && (
              <p id="category-error" className="field-error" role="alert">
                {String(errors.category.message)}
              </p>
            )}
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6, color: "rgb(var(--accent-rgb))" }}>Date & time</label>
            <input
              className={`auth-input ${errors.date ? "error" : ""}`}
              {...register("date", { required: "Date & time is required" })}
              type="datetime-local"
              aria-invalid={errors.date ? "true" : "false"}
              aria-describedby={errors.date ? "date-error" : undefined}
            />
            {errors.date && (
              <p id="date-error" className="field-error" role="alert">
                {String(errors.date.message)}
              </p>
            )}
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", marginBottom: 6, color: "rgb(var(--accent-rgb))" }}>Description</label>
            <textarea
              className={`auth-input auth-textarea ${errors.description ? "error" : ""}`}
              {...register("description", { maxLength: { value: 500, message: "Description is too long" } })}
              rows={3}
              placeholder="Optional — add notes like merchant name, receipt number, or split details"
              aria-invalid={errors.description ? "true" : "false"}
              aria-describedby={errors.description ? "description-error" : undefined}
            />
            {errors.description && (
              <p id="description-error" className="field-error" role="alert">
                {String(errors.description.message)}
              </p>
            )}
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6 }}>
            <button type="button" className="auth-ghost" onClick={onCancel}>
              Cancel
            </button>
            {/* Keep .auth-btn exactly as in your original project so the color remains unchanged */}
            <button type="submit" className="auth-btn">
              {initial ? "Save changes" : "Add transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
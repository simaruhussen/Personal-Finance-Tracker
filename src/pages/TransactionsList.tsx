// src/pages/TransactionsList.tsx
import React, { useMemo, useState, useEffect } from "react";
import type { Transaction } from "../lib/types";
import { FaRegTrashAlt, FaRegEdit, FaInfoCircle } from "react-icons/fa";

type Props = {
  transactions: Transaction[];
  onDetail: (tx: Transaction) => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
};

export default function TransactionsList({ transactions, onDetail, onEdit, onDelete }: Props) {
  // filters
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // pagination
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // responsive: detect mobile breakpoint (<= 520px)
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== "undefined" ? window.matchMedia("(max-width:520px)").matches : false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width:520px)");
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    // For browsers that support addEventListener on MediaQueryList
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      setIsMobile(mq.matches);
      return () => mq.removeEventListener("change", onChange);
    } else {
      // fallback
      mq.addListener(onChange);
      setIsMobile(mq.matches);
      return () => mq.removeListener(onChange);
    }
  }, []);

  // Filter transactions by date range (inclusive end day)
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const ts = new Date(t.date).getTime();
      if (startDate) {
        const s = new Date(startDate).getTime();
        if (ts < s) return false;
      }
      if (endDate) {
        const e = new Date(endDate);
        e.setHours(23, 59, 59, 999);
        if (ts > e.getTime()) return false;
      }
      return true;
    });
  }, [transactions, startDate, endDate]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  // keep page in range
  useEffect(() => {
    if (page > pageCount) setPage(1);
  }, [pageCount, page]);

  const current = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page, pageSize]);
  const gotoPage = (p: number) => setPage(Math.min(Math.max(1, p), pageCount));

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 12, color: "rgb(var(--accent-rgb))" }}>Transaction List</h1>

      {/* Filters row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ fontSize: 13, color: "rgb(var(--accent-rgb))" }}>From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
            className="auth-input"
            style={{ width: 170 }}
          />

          <label style={{ fontSize: 13, color: "rgb(var(--accent-rgb))" }}>To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
            className="auth-input"
            style={{ width: 170 }}
          />

          <button
            className="auth-ghost"
            onClick={() => { setStartDate(""); setEndDate(""); setPage(1); }}
          >
            Clear
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 13, color: "rgb(var(--accent-rgb))" }}>Page size</div>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="auth-input"
            style={{ width: 90 }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Desktop/table view */}
      {!isMobile && (
        <div className="card table-responsive" style={{ padding: 0 }}>
          <table className="transactions-table" style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
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
              {current.map((tx) => (
                <tr key={tx.id} style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                  <td data-label="Amount" style={{ padding: "18px 16px", color: "rgb(var(--accent-rgb))", fontWeight: 700 }}>
                    {Math.abs(tx.amount).toLocaleString()}
                  </td>

                  <td data-label="Type" style={{ padding: "18px 16px", color: tx.type === "income" ? "rgb(var(--secondary-rgb))" : "rgba(255,80,80,1)" }}>
                    {tx.type}
                  </td>

                  <td data-label="Category" style={{ padding: "18px 16px", color: "rgb(var(--accent-rgb))" }}>
                    {tx.category}
                  </td>

                  <td data-label="Date" style={{ padding: "18px 16px", color: "rgba(var(--accent-rgb),0.8)" }}>
                    {new Date(tx.date).toLocaleString()}
                  </td>

                  <td data-label="Actions" style={{ padding: "18px 16px", display: "flex", gap: 8, alignItems: "center" }}>
                    <button
                      title="Detail"
                      aria-label="View details"
                      onClick={() => onDetail(tx)}
                      style={{ border: "none", background: "transparent", cursor: "pointer", padding: 6, whiteSpace: "nowrap" }}
                    >
                      <FaInfoCircle color="rgb(var(--accent-rgb))" />
                    </button>

                    <button
                      title="Edit"
                      aria-label="Edit transaction"
                      onClick={() => onEdit(tx)}
                      style={{ border: "none", background: "transparent", cursor: "pointer", padding: 6, whiteSpace: "nowrap" }}
                    >
                      <FaRegEdit color="rgb(var(--accent-rgb))" />
                    </button>

                    <button
                      title="Delete"
                      aria-label="Delete transaction"
                      onClick={() => onDelete(tx.id)}
                      style={{ border: "none", background: "transparent", cursor: "pointer", padding: 6, whiteSpace: "nowrap" }}
                    >
                      <FaRegTrashAlt color="rgba(255,60,60,0.9)" />
                    </button>
                  </td>
                </tr>
              ))}

              {current.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 24, textAlign: "center", color: "rgba(var(--accent-rgb),0.7)" }}>
                    No transactions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile card view (no horizontal scroll) */}
      {isMobile && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {current.map((tx) => (
            <article
              key={tx.id}
              style={{
                background: "rgb(var(--card-rgb))",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: 10,
                padding: 12,
                boxShadow: "0 6px 14px rgba(9,10,12,0.04)",
                color: "rgb(var(--accent-rgb))",
              }}
              aria-labelledby={`tx-${tx.id}-amount`}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div id={`tx-${tx.id}-amount`} style={{ fontWeight: 800, fontSize: 16 }}>{Math.abs(tx.amount).toLocaleString()}</div>
                  <div style={{ color: "rgba(var(--accent-rgb),0.75)", fontSize: 13, marginTop: 4 }}>{tx.category}</div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ color: tx.type === "income" ? "rgb(var(--secondary-rgb))" : "rgba(255,80,80,1)", fontWeight: 700 }}>{tx.type}</div>
                  <div style={{ color: "rgba(var(--accent-rgb),0.7)", fontSize: 12, marginTop: 6 }}>{new Date(tx.date).toLocaleString()}</div>
                </div>
              </div>

              {/* actions placed under the fields on mobile */}
              <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
                <button
                  onClick={() => onDetail(tx)}
                  style={{ border: "1px solid rgba(var(--accent-rgb),0.08)", background: "transparent", padding: "8px 12px", borderRadius: 8, cursor: "pointer" }}
                >
                  Detail
                </button>

                <button
                  onClick={() => onEdit(tx)}
                  style={{ border: "1px solid rgba(var(--accent-rgb),0.08)", background: "transparent", padding: "8px 12px", borderRadius: 8, cursor: "pointer" }}
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(tx.id)}
                  style={{ border: "1px solid rgba(220,60,60,0.12)", background: "transparent", padding: "8px 12px", borderRadius: 8, cursor: "pointer", color: "rgb(220,60,60)" }}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}

          {current.length === 0 && (
            <div style={{ padding: 16, textAlign: "center", color: "rgba(var(--accent-rgb),0.7)" }}>No transactions yet.</div>
          )}
        </div>
      )}

      {/* Pagination */}
      <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div className="pagination" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <button className="page-btn" onClick={() => gotoPage(1)} disabled={page === 1}>First</button>
          <button className="page-btn" onClick={() => gotoPage(page - 1)} disabled={page === 1}>Prev</button>

          {Array.from({ length: pageCount }).map((_, idx) => {
            const p = idx + 1;
            if (Math.abs(p - page) > 3 && p !== 1 && p !== pageCount) return null;
            return (
              <button
                key={p}
                onClick={() => gotoPage(p)}
                className="page-btn"
                style={{ fontWeight: p === page ? 800 : 500, background: p === page ? "rgba(var(--primary-rgb),0.12)" : undefined }}
              >
                {p}
              </button>
            );
          })}

          <button className="page-btn" onClick={() => gotoPage(page + 1)} disabled={page === pageCount}>Next</button>
          <button className="page-btn" onClick={() => gotoPage(pageCount)} disabled={page === pageCount}>Last</button>
        </div>

        <div style={{ color: "rgba(var(--accent-rgb),0.75)" }}>
          Showing {(page - 1) * pageSize + (current.length ? 1 : 0)}-{(page - 1) * pageSize + current.length} of {total}
        </div>
      </div>
    </div>
  );
}
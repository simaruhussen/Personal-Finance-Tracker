import React from "react";

const items = [
  { label: "Transactions", icon: "🧾" },
  { label: "Reports", icon: "📊" },
  { label: "Summary", icon: "📈" },
  { label: "Calendar", icon: "📅" },
  { label: "Settings", icon: "⚙️" },
];

export default function Sidebar(): JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          background: `rgb(var(--primary-rgb))`,
          display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700
        }}>FT</div>
        <div style={{ fontWeight: 700 }}>FinanceTracker</div>
      </div>

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map(it => (
          <button key={it.label} style={{
            textAlign: "left", padding: 12, borderRadius: 12, border: "none",
            background: "transparent", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 16 }}>{it.icon}</span>
              <span style={{ fontWeight: 600 }}>{it.label}</span>
            </div>
            <span style={{ opacity: 0.45 }}>›</span>
          </button>
        ))}
      </nav>

      <div style={{ marginTop: 12 }}>
        <div style={{ color: "rgba(0,0,0,0.5)", fontSize: 13 }}>Overview of your finances</div>
        <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6 }}>$12,345</div>
      </div>
    </div>
  );
}
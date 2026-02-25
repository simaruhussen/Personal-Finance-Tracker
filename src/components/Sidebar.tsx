// src/components/Sidebar.tsx
import React, { useState } from "react";
import { HiOutlineHome, HiOutlineClock, HiOutlineChartBar } from "react-icons/hi";
import { FaExchangeAlt, FaMoneyBillWave, FaCog } from "react-icons/fa";

type Props = {
  active: string;
  onNavigate: (view: string, payload?: any) => void;
};

export default function Sidebar({ active, onNavigate }: Props) {
  const [txOpen, setTxOpen] = useState<boolean>(false);

  const navBtnStyle = (isActive = false): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 10,
    background: isActive ? "rgba(var(--primary-rgb), 0.06)" : "transparent",
    boxShadow: isActive ? "0 6px 18px rgba(var(--primary-rgb), 0.12)" : "none",
    color: "rgb(var(--accent-rgb))",
    border: "none",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
  });

  return (
    <aside style={{ width: "260px", padding: 20, display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgb(var(--primary-rgb))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>FT</div>
        <div style={{ fontWeight: 700, color: "rgb(var(--accent-rgb))" }}>FinanceTracker</div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <button style={navBtnStyle(active === "home")} onClick={() => onNavigate("home")}>
          <HiOutlineHome /> Home
        </button>

        <div>
          {/* Transactions top-level label */}
          <button
            style={navBtnStyle(active === "transactions" || txOpen)}
            onClick={() => {
              setTxOpen((s) => !s);
              onNavigate("transactions"); // highlight top label
            }}
          >
            <FaExchangeAlt />
            Transactions
            <div style={{ marginLeft: "auto", opacity: 0.7 }}>{txOpen ? "▾" : "▸"}</div>
          </button>

          {/* Submenu when Transactions expanded */}
          {txOpen && (
            <div style={{ marginTop: 8, marginLeft: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              <button
                style={{
                  ...navBtnStyle(active === "transactions.list"),
                  paddingLeft: 18,
                  fontSize: 14,
                }}
                onClick={() => onNavigate("transactions.list")}
              >
                <HiOutlineClock /> Transaction List
              </button>

              <button
                style={{
                  ...navBtnStyle(active === "transactions.add"),
                  paddingLeft: 18,
                  fontSize: 14,
                }}
                onClick={() => onNavigate("transactions.add")}
              >
                <FaMoneyBillWave /> Add Transaction
              </button>
            </div>
          )}
        </div>

        <button style={navBtnStyle(active === "reports")} onClick={() => onNavigate("reports")}>
          <HiOutlineChartBar /> Reports
        </button>

        <button style={navBtnStyle(active === "settings")} onClick={() => onNavigate("settings")}>
          <FaCog /> Settings
        </button>
      </nav>

      {/* bottom summary */}
      <div style={{ marginTop: 12 }}>
        <div style={{ color: "rgba(var(--accent-rgb), 0.9)", fontSize: 13 }}>Overview of your finances</div>
        <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6, color: "rgb(var(--accent-rgb))" }}>$12,345</div>
      </div>
    </aside>
  );
}
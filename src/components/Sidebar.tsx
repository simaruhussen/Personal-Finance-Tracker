// src/components/Sidebar.tsx
import React, { useEffect, useState } from "react";
import { HiOutlineHome, HiOutlineClock, HiOutlineChartBar } from "react-icons/hi";
import { FaExchangeAlt, FaMoneyBillWave, FaCog } from "react-icons/fa";
import logo from "../assets/logoforft.png";
import { useSummaryQuery, queryErrorToMessage } from "../features/transactions/queries";

type Props = {
  active: string;
  onNavigate: (view: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ active, onNavigate, isOpen = false, onClose }: Props) {
  const [txOpen, setTxOpen] = useState<boolean>(false);
  const [isSmall, setIsSmall] = useState<boolean>(false);

  // summary data for overview (income / expenses / balance)
  const { data, isLoading, isError, error } = useSummaryQuery();
  const totalIncome = data?.totalIncome ?? 0;
  const totalExpenses = data?.totalExpenses ?? 0;
  const balance = data?.balance ?? 0;

  useEffect(() => {
    const onResize = () => setIsSmall(window.innerWidth <= 1000);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (active.startsWith("transactions")) setTxOpen(true);
  }, [active]);

  const primaryBg = "rgba(var(--primary-rgb), 0.06)";
  const primaryShadow = "0 6px 18px rgba(var(--primary-rgb), 0.12)";

  const navBtnStyle = (isActive = false): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 10,
    background: isActive ? primaryBg : "transparent",
    boxShadow: isActive ? primaryShadow : "none",
    color: "rgb(var(--accent-rgb))",
    border: "none",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
  });

  const renderOverviewValue = () => {
    if (isLoading) {
      return (
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            marginTop: 6,
            color: "rgba(var(--accent-rgb),0.75)",
          }}
        >
          Loading…
        </div>
      );
    }

    if (isError) {
      return (
        <div
          style={{
            fontSize: 13,
            marginTop: 6,
            color: "#b91c1c",
            maxWidth: 220,
            lineHeight: 1.2,
          }}
        >
          {queryErrorToMessage(error)}
        </div>
      );
    }

    return (
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          marginTop: 6,
          color: "rgb(var(--accent-rgb))",
        }}
        aria-live="polite"
      >
        birr {Number(balance).toLocaleString()}
      </div>
    );
  };

  const desktopSidebar = (
    <aside className="app-sidebar desktop-only" aria-hidden={isSmall}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div
          style={{
            width: 65,
            height: 65,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(var(--primary-rgb),0.1)",
            fontWeight: 800,
            color: "rgb(var(--accent-rgb))",
            overflow: "hidden",
          }}
          aria-label="Finance Tracker"
        >
          <img src={logo} alt="FinanceTracker logo" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>

        <div style={{ fontWeight: 700, color: "rgb(var(--accent-rgb))" }}>FinanceTracker</div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <button style={navBtnStyle(active === "home")} onClick={() => onNavigate("home")}>
          <HiOutlineHome /> Home
        </button>

        <div>
          <button
            style={navBtnStyle(active.startsWith("transactions"))}
            onClick={() => {
              setTxOpen((s) => !s);
              onNavigate("transactions.list");
            }}
            aria-expanded={txOpen}
          >
            <FaExchangeAlt />
            Transactions
            <div style={{ marginLeft: "auto", opacity: 0.75 }}>{txOpen ? "▾" : "▸"}</div>
          </button>

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

      <div style={{ marginTop: 12 }}>
        <div style={{ color: "rgba(var(--accent-rgb), 0.9)", fontSize: 13 }}>Overview of your finances</div>
        {renderOverviewValue()}
      </div>
    </aside>
  );

  const mobileOverlayOpen = Boolean(isOpen);
  return (
    <>
      {desktopSidebar}

      <div className={`mobile-sidebar-overlay${mobileOverlayOpen ? " open" : ""}`} role="presentation" onClick={onClose}>
        <aside
          className={`mobile-sidebar-panel${mobileOverlayOpen ? " open" : ""}`}
          role="navigation"
          aria-label="Mobile menu"
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(var(--primary-rgb),0.1)",
                  fontWeight: 800,
                  color: "rgb(var(--accent-rgb))",
                  overflow: "hidden",
                }}
              >
                <img src={logo} alt="FinanceTracker logo" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ fontWeight: 700, color: "rgb(var(--accent-rgb))" }}>FinanceTracker</div>
            </div>

            <div>
              <button
                onClick={() => {
                  onNavigate("home");
                  onClose?.();
                }}
                style={{ marginRight: 8 }}
                aria-label="Home"
              >
                Home
              </button>
            </div>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button style={navBtnStyle(active === "home")} onClick={() => { onNavigate("home"); onClose?.(); }}>
              <HiOutlineHome /> Home
            </button>

            <button
              style={navBtnStyle(active.startsWith("transactions"))}
              onClick={() => {
                setTxOpen((s) => !s);
                onNavigate("transactions.list");
              }}
            >
              <FaExchangeAlt /> Transactions
            </button>

            {txOpen && (
              <div style={{ marginTop: 8, marginLeft: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                <button
                  style={{ ...navBtnStyle(active === "transactions.list"), paddingLeft: 18 }}
                  onClick={() => { onNavigate("transactions.list"); onClose?.(); }}
                >
                  <HiOutlineClock /> Transaction List
                </button>

                <button
                  style={{ ...navBtnStyle(active === "transactions.add"), paddingLeft: 18 }}
                  onClick={() => { onNavigate("transactions.add"); onClose?.(); }}
                >
                  <FaMoneyBillWave /> Add Transaction
                </button>
              </div>
            )}

            <button style={navBtnStyle(active === "reports")} onClick={() => { onNavigate("reports"); onClose?.(); }}>
              <HiOutlineChartBar /> Reports
            </button>
            <button style={navBtnStyle(active === "settings")} onClick={() => { onNavigate("settings"); onClose?.(); }}>
              <FaCog /> Settings
            </button>
          </nav>

          <div style={{ marginTop: 12 }}>
            <div style={{ color: "rgba(var(--accent-rgb), 0.9)", fontSize: 13 }}>Overview of your finances</div>
            {renderOverviewValue()}
          </div>
        </aside>
      </div>
    </>
  );
}
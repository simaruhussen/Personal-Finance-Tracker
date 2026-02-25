// src/components/Sidebar.tsx
import React, { useState, useEffect } from "react";
import { HiOutlineHome, HiOutlineClock, HiOutlineChartBar } from "react-icons/hi";
import { FaExchangeAlt, FaMoneyBillWave, FaCog } from "react-icons/fa";

type Props = {
  active: string;
  onNavigate: (view: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ active, onNavigate, isOpen = false, onClose }: Props) {
  const [txOpen, setTxOpen] = useState<boolean>(false);
  const [isSmall, setIsSmall] = useState<boolean>(false);

  useEffect(() => {
    const onResize = () => setIsSmall(window.innerWidth <= 1000);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Ensure submenu opens when active view is under transactions
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

  // Hide desktop sidebar on small screens (the CSS already hides .app-sidebar at <=1000px)
  // We still return null for very small screens to ensure no duplicate UI, but we rely on CSS rules for display.
  // Desktop sidebar:
  const desktopSidebar = (
    <aside className="app-sidebar desktop-only" aria-hidden={isSmall}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: "rgb(var(--primary-rgb))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          FT
        </div>
        <div style={{ fontWeight: 700, color: "rgb(var(--accent-rgb))" }}>FinanceTracker</div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <button style={navBtnStyle(active === "home")} onClick={() => onNavigate("home")}>
          <HiOutlineHome /> Home
        </button>

        {/* Transactions top-level */}
        <div>
          <button
            style={navBtnStyle(active.startsWith("transactions"))}
            onClick={() => {
              // open sub-menu and navigate to transaction list immediately
              setTxOpen((s) => !s);
              onNavigate("transactions.list");
            }}
            aria-expanded={txOpen}
          >
            <FaExchangeAlt />
            Transactions
            <div style={{ marginLeft: "auto", opacity: 0.75 }}>{txOpen ? "▾" : "▸"}</div>
          </button>

          {/* Submenu */}
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
        <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6, color: "rgb(var(--accent-rgb))" }}>$12,345</div>
      </div>
    </aside>
  );

  // Mobile overlay & panel are controlled by CSS classes in index.css; render regardless and CSS will show/hide.
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
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgb(var(--primary-rgb))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>
                FT
              </div>
              <div style={{ fontWeight: 700, color: "rgb(var(--accent-rgb))" }}>FinanceTracker</div>
            </div>

            <div>
              <button onClick={() => { onNavigate("home"); onClose?.(); }} style={{ marginRight: 8 }} aria-label="Home">Home</button>
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
                // keep mobile panel open so user sees submenu (or close if desired)
              }}
            >
              <FaExchangeAlt /> Transactions <div style={{ marginLeft: "auto", opacity: 0.75 }}>{txOpen ? "▾" : "▸"}</div>
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
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6, color: "rgb(var(--accent-rgb))" }}>$12,345</div>
          </div>
        </aside>
      </div>
    </>
  );
}
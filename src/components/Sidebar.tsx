// src/components/Sidebar.tsx
import React, { useEffect, useState } from "react";
import { HiOutlineHome, HiOutlineClock, HiOutlineChartBar } from "react-icons/hi";
import { FaExchangeAlt, FaMoneyBillWave, FaCog } from "react-icons/fa";
import logo from "../assets/logoforpft.png";

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

  // ensure submenu opens when active view is under transactions
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

  // Desktop sidebar
  const desktopSidebar = (
    <aside className="app-sidebar desktop-only" aria-hidden={isSmall}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        {/* Imported image badge (keeps same size & rounded corners as before) */}
        <img
          src={logo}
          alt="logo"
          style={{
            width: 60,
            height: 60,
            borderRadius: 8,
            objectFit: "cover",
            display: "block",
          }}
        />

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
              setTxOpen((s) => !s);
              onNavigate("transactions.list"); // open submenu and navigate to list
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

  // Mobile overlay & panel (uses same logo but slightly smaller)
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
              <img
                src={logo}
                alt="logo"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  objectFit: "cover",
                  display: "block",
                }}
              />
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
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6, color: "rgb(var(--accent-rgb))" }}>$12,345</div>
          </div>
        </aside>
      </div>
    </>
  );
}
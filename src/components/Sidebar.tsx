// src/components/Sidebar.tsx
import React, { useEffect, useState } from "react";
import {
  HiOutlineHome,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineMoon,
  HiOutlineSun,
} from "react-icons/hi";
import { FaExchangeAlt, FaMoneyBillWave, FaCog } from "react-icons/fa";
import logo from "../assets/logoforft.png";
import { useAccountsQuery, queryErrorToMessage } from "../features/accounts/queries";

type Props = {
  active: string;
  onNavigate: (view: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
};

const THEME_KEY = "theme";

export default function Sidebar({ active, onNavigate, isOpen = false, onClose, onLogout }: Props) {
  const [txOpen, setTxOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [isSmall, setIsSmall] = useState<boolean>(false);

  // accounts data for sidebar balance
  const { data: accounts, isLoading, isError, error, refetch } = useAccountsQuery();
  const totalBalance = React.useMemo(() => {
    if (!accounts) return 0;
    return accounts.reduce((sum, a) => sum + Number(a.balance ?? 0), 0);
  }, [accounts]);

  // theme state (keeps same persistence as Header via THEME_KEY)
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const t = localStorage.getItem(THEME_KEY);
      return t === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

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

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

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
          <button
            type="button"
            className="auth-ghost"
            style={{ marginTop: 8, display: "block" }}
            onClick={() => refetch()}
          >
            Retry
          </button>
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
        birr {Number(totalBalance).toLocaleString()}
      </div>
    );
  };

  // Logout handler: prefer parent callback; fallback clears token and redirects to /login
  const handleLogout = () => {
    try {
      if (typeof onLogout === "function") {
        onLogout();
      } else {
        try {
          localStorage.removeItem("token");
        } catch {}
        window.location.href = "/login";
      }
    } catch (e) {
      console.error("Sidebar logout error:", e);
    } finally {
      // close mobile sidebar if provided
      try {
        onClose?.();
      } catch {}
    }
  };

  const SettingsSubpanel = ({ compact = false }: { compact?: boolean }) => (
    <div
      role="group"
      aria-label="Settings actions"
      style={{
        marginTop: 8,
        marginLeft: 8,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: compact ? 6 : 12,
        borderRadius: 10,
        background: compact ? "transparent" : "rgba(var(--primary-rgb),0.04)",
        border: compact ? "none" : "1px solid rgba(var(--primary-rgb),0.06)",
        width: compact ? "auto" : "calc(100% - 8px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              display: "grid",
              placeItems: "center",
              background: "rgba(var(--primary-rgb),0.06)",
            }}
          >
            {theme === "dark" ? <HiOutlineSun size={18} color="#FFD43B" /> : <HiOutlineMoon size={18} color="rgb(var(--accent-rgb))" />}
          </div>
          <div>
            <div style={{ fontSize: 13, color: "rgba(var(--accent-rgb),0.9)" }}>Theme</div>
            <div style={{ fontSize: 13, color: "rgba(var(--accent-rgb),0.6)" }}>{theme === "dark" ? "Dark" : "Light"}</div>
          </div>
        </div>

        <div>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid rgba(var(--accent-rgb),0.12)",
              background: "transparent",
              cursor: "pointer",
              color: "rgb(var(--accent-rgb))",
            }}
          >
            Toggle
          </button>
        </div>
      </div>

      <div style={{ height: 6 }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              display: "grid",
              placeItems: "center",
              background: "rgba(var(--primary-rgb),0.06)",
            }}
          >
            <FaCog color="rgb(var(--accent-rgb))" />
          </div>
          <div>
            <div style={{ fontSize: 13, color: "rgba(var(--accent-rgb),0.9)" }}>Account</div>
            <div style={{ fontSize: 13, color: "rgba(var(--accent-rgb),0.6)" }}>Logout</div>
          </div>
        </div>

        <div>
          <button
            onClick={handleLogout}
            aria-label="Logout"
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid rgba(220,38,38,0.12)",
              background: "transparent",
              cursor: "pointer",
              color: "#b91c1c",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  // Desktop sidebar
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

        <div>
          <button
            style={navBtnStyle(active === "settings")}
            onClick={() => {
              // only toggle the inline settings subpanel — DO NOT call onNavigate
              setSettingsOpen((s) => !s);
            }}
            aria-expanded={settingsOpen}
          >
            <FaCog /> Settings
            <div style={{ marginLeft: "auto", opacity: 0.75 }}>{settingsOpen ? "▾" : "▸"}</div>
          </button>

          {settingsOpen && (
            <div style={{ marginTop: 8, marginLeft: 8 }}>
              <SettingsSubpanel />
            </div>
          )}
        </div>
      </nav>

      <div style={{ marginTop: 12 }}>
        <div style={{ color: "rgba(var(--accent-rgb), 0.9)", fontSize: 13 }}>Overview of your finances</div>
        {renderOverviewValue()}
      </div>
    </aside>
  );

  // Mobile panel
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

            <button
              style={navBtnStyle(active === "reports")}
              onClick={() => {
                onNavigate("reports");
                onClose?.();
              }}
            >
              <HiOutlineChartBar /> Reports
            </button>
          </nav>

          {/* Settings button + inline subpanel for mobile */}
          <div style={{ marginTop: 8 }}>
            <button
              style={navBtnStyle(active === "settings")}
              onClick={() => {
                setSettingsOpen((s) => !s);
                // keep mobile sidebar open; user can close via overlay or logout
              }}
              aria-expanded={settingsOpen}
            >
              <FaCog /> Settings
              <div style={{ marginLeft: "auto", opacity: 0.75 }}>{settingsOpen ? "▾" : "▸"}</div>
            </button>

            {settingsOpen && (
              <div style={{ marginTop: 8, marginLeft: 8 }}>
                <SettingsSubpanel compact />
              </div>
            )}
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ color: "rgba(var(--accent-rgb), 0.9)", fontSize: 13 }}>Overview of your finances</div>
            {renderOverviewValue()}
          </div>
        </aside>
      </div>
    </>
  );
}
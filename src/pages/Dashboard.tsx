// src/pages/Dashboard.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuth } from "../features/auth/AuthProvider";
import type { User } from "../features/auth/types";

export type DashboardOutletContext = {
  currentUser: User;
};

export default function Dashboard() {
  const { user, logout } = useAuth();

  // sidebar state for mobile panel
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  // close sidebar with Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSidebarOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const activeSidebarKey = useMemo(() => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path === "/transactions") return "transactions.list";
    if (path === "/transactions/new") return "transactions.add";
    if (path.startsWith("/transactions/")) return "transactions.list";
    if (path === "/reports") return "reports";
    return "home";
  }, [location.pathname]);

  const handleNavigate = (key: string) => {
    setSidebarOpen(false); // close mobile panel on navigate
    if (key === "home") navigate("/");
    else if (key === "transactions") navigate("/transactions");
    else if (key === "transactions.list") navigate("/transactions");
    else if (key === "transactions.add") navigate("/transactions/new");
    else if (key === "reports") navigate("/reports");
    else navigate("/");
  };

  if (!user) return null;

  return (
    <div className="app-root" role="application">
      {/* Sidebar is fixed by CSS; pass mobile open/close props for overlay panel */}
      <Sidebar active={activeSidebarKey} onNavigate={handleNavigate} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Right content area: header (sticky) + main (scrollable) */}
      <div className="app-right">
        <header className="app-header">
          <Header currentUser={user} onLogout={logout} onToggleSidebar={() => setSidebarOpen((s) => !s)} sidebarOpen={sidebarOpen} />
        </header>

        <main className="app-main">
          <div style={{ width: "100%", maxWidth: 1200 }}>
            <Outlet context={{ currentUser: user } satisfies DashboardOutletContext} />
          </div>
        </main>
      </div>
    </div>
  );
}
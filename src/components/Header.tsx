// src/components/Header.tsx
import React, { useEffect, useState } from "react";
import type { User } from "../features/auth/types";
import { HiOutlineMoon, HiOutlineSun, HiOutlineBell, HiMenu } from "react-icons/hi";

type Props = {
  currentUser: User | null;
  onLogout: () => void;
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
};

const THEME_KEY = "theme";

export default function Header({ currentUser, onLogout, onToggleSidebar, sidebarOpen }: Props) {
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
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%", gap: 12 }}>
      {/* mobile-only hamburger (visible via CSS on small screens) */}
      {onToggleSidebar && (
        <button
          className="mobile-menu-btn mobile-only"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={Boolean(sidebarOpen)}
          onClick={onToggleSidebar}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 42,
            height: 42,
            borderRadius: 10,
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          <HiMenu size={22} />
        </button>
      )}


      <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
        {/* desktop-only controls (user, notifications, settings) */}
        <div className="desktop-only" style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {currentUser && (
            <div style={{ fontWeight: 700, color: "rgb(var(--accent-rgb))" }}>
              {currentUser.fullName || currentUser.email}
            </div>
          )}

          <button aria-label="Notifications" title="Notifications" style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer" }}>
            <HiOutlineBell size={18} />
          </button>

         
        </div>

        {/* theme toggle (visible on all sizes) */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: 10,
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          {theme === "dark" ? <HiOutlineSun size={18} color="#FFD43B" /> : <HiOutlineMoon size={18} color="rgb(var(--accent-rgb))" />}
        </button>

        {/* mobile-only: logout visible on the header for small screens */}
        <button onClick={onLogout} className="auth-ghost mobile-only" style={{ padding: "8px 12px", borderRadius: 8 }}>
          Logout
        </button>

        {/* desktop logout */}
        <button onClick={onLogout} className="auth-ghost desktop-only" style={{ padding: "8px 12px", borderRadius: 8 }}>
          Logout
        </button>
      </div>
    </div>
  );
}
// src/components/Header.tsx
import React, { useEffect, useState } from "react";
import type { MockUser } from "../lib/auth";
import { HiOutlineMoon, HiOutlineSun, HiOutlineBell } from "react-icons/hi";

type Props = {
  currentUser: MockUser | null;
  onLogout: () => void;
};

const THEME_KEY = "theme"; // 'light' | 'dark'

export default function Header({ currentUser, onLogout }: Props): JSX.Element {
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
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // Icon color decisions:
  // - In dark mode: show yellow sun (visible on dark bg)
  // - In light mode: show moon with accent color
  const sunColor = "#FFD43B"; // warm yellow for sun
  const moonColor = "rgb(var(--accent-rgb))"; // uses accent variable (light/dark aware)

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: `rgb(var(--primary-rgb))`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
          }}
        >
          FT
        </div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>FinanceTracker</div>
      </div>

      <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
        {/* username */}
        {currentUser && <div style={{ fontWeight: 700 }}>{currentUser.username}</div>}

        {/* theme toggle */}
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
          {theme === "dark" ? (
            // show sun (yellow) while in dark mode
            <HiOutlineSun size={20} color={sunColor} />
          ) : (
            // show moon in light mode (use accent color)
            <HiOutlineMoon size={20} color={moonColor as unknown as string} />
          )}
        </button>

        {/* notifications */}
        <button
          aria-label="Notifications"
          title="Notifications"
          style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer" }}
        >
          <HiOutlineBell size={18} color="currentColor" />
        </button>

        {/* settings */}
        

        {/* logout */}
        <button onClick={onLogout} className="auth-ghost" style={{ padding: "8px 12px", borderRadius: 8 }}>
          Logout
        </button>
      </div>
    </div>
  );
}
import React from "react";
import type { MockUser } from "../lib/auth";

type Props = {
  currentUser: MockUser | null;
  onLogout: () => void;
};

export default function Header({ currentUser, onLogout }: Props): JSX.Element {
  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: `rgb(var(--primary-rgb))`,
          display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800
        }}>FT</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>FinanceTracker</div>
      </div>

      <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
        {currentUser && <div style={{ fontWeight: 700 }}>{currentUser.username}</div>}
        <button aria-label="notifications" title="Notifications" style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer" }}>🔔</button>

        <button aria-label="settings" title="Settings" style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer" }}>⚙️</button>

        <button onClick={onLogout} className="auth-ghost" style={{ padding: "8px 12px", borderRadius: 8 }}>
          Logout
        </button>
      </div>
    </div>
  );
}
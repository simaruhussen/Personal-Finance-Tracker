import React, { type JSX } from "react";

const links = ["Accounts", "Projects", "Forecast", "Cash Flow"];

export default function QuickLinksCard(): JSX.Element {
  return (
    <div className="card" style={{ padding: 16 }}>
      <h4 style={{ margin: 0, fontWeight: 700, marginBottom: 12 }}>Quick Links</h4>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
        {links.map((l) => (
          <li key={l} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, background: "rgba(134,173,15,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>🔗</div>
              <div style={{ fontWeight: 600 }}>{l}</div>
            </div>
            <div style={{ color: "rgba(0,0,0,0.35)" }}>↪</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
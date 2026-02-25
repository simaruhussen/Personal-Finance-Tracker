import React, { type JSX } from "react";

export default function OverviewCard(): JSX.Element {
  return (
    <div className="card card-big" style={{ padding: 18 }}>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, marginBottom: 12, color: "rgb(var(--accent-rgb))" }}>Income & Expenses</h3>

      <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(var(--accent-rgb), 0.45)" }}>
        {/* Replace with actual Recharts bar/line chart */}
        <div>[Bar chart placeholder — integrate Recharts here]</div>
      </div>
    </div>
  );
}
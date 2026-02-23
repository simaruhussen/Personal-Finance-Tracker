import React, { type JSX } from "react";

export default function OverviewCard(): JSX.Element {
  return (
    <div className="card card-big" style={{ padding: 18 }}>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Income & Expenses</h3>
      <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(0,0,0,0.35)" }}>
        <div>[Bar chart placeholder — integrate Recharts here]</div>
      </div>
    </div>
  );
}
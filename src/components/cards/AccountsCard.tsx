import React, { type JSX } from "react";

export default function AccountsCard(): JSX.Element {
  return (
    <div className="card card-big" style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Your Accounts</h3>
        <button style={{
          padding: "6px 10px",
          borderRadius: 8,
          border: "none",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          fontSize: 12,
          cursor: "pointer"
        }}>Upgrade plan</button>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ color: "rgba(0,0,0,0.6)" }}>Checking Account</div>
          <div style={{ fontWeight: 700 }}>$8,500</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ color: "rgba(0,0,0,0.6)" }}>Savings</div>
          <div style={{ fontWeight: 700, color: `rgb(var(--secondary-rgb))` }}>$3,000</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ color: "rgba(0,0,0,0.6)" }}>Cash</div>
          <div style={{ fontWeight: 700 }}>$845</div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid rgba(0,0,0,0.06)", margin: "8px 0" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "rgba(0,0,0,0.6)" }}>Total Balance</div>
          <div style={{ fontWeight: 900, fontSize: 20 }}>$12,345</div>
        </div>
      </div>
    </div>
  );
}
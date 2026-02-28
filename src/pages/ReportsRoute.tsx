import React from "react";
import AccountsCard from "../components/cards/AccountsCard";

export default function ReportsRoute() {
  return (
    <>
      <h2
        style={{
          fontSize: 24,
          fontWeight: 800,
          margin: "0 0 16px 0",
          color: "rgb(var(--accent-rgb))",
        }}
      >
        Reports
      </h2>

      <p
        style={{
          margin: "0 0 20px 0",
          color: "rgba(var(--accent-rgb),0.75)",
          fontSize: 14,
          maxWidth: 520,
        }}
      >
        Edit the balances of your main accounts (checking, savings, and cash). Your total balance will update automatically based on
        these values.
      </p>

      <div style={{ maxWidth: 520 }}>
        <AccountsCard editable />
      </div>
    </>
  );
}


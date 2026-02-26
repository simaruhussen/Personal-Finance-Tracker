import React from "react";
import { useOutletContext } from "react-router-dom";
import AccountsCard from "../components/cards/AccountsCard";
import RecentTransactionsCard from "../components/cards/RecentTransactionsCard";
import OverviewCard from "../components/cards/OverviewCard";
import ChartCard from "../components/cards/ChartCard";
import QuickLinksCard from "../components/cards/QuickLinksCard";
import type { DashboardOutletContext } from "./Dashboard";

export default function DashboardHome() {
  const { currentUser } = useOutletContext<DashboardOutletContext>();

  return (
    <>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 16px 0", color: "rgb(var(--accent-rgb))" }}>
        Welcome back, {currentUser.fullName || currentUser.email}!
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <AccountsCard />
            <RecentTransactionsCard />
          </div>

          <OverviewCard />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <ChartCard />
          <QuickLinksCard />
        </div>
      </div>
    </>
  );
}


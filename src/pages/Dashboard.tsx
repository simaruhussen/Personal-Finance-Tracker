import React, { type JSX } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AccountsCard from "../components/cards/AccountsCard";
import RecentTransactionsCard from "../components/cards/RecentTransactionsCard";
import OverviewCard from "../components/cards/OverviewCard";
import ChartCard from "../components/cards/ChartCard";
import QuickLinksCard from "../components/cards/QuickLinksCard";
import { logout as authLogout } from "../lib/auth";
import type { MockUser } from "../lib/auth";

type Props = {
  currentUser: MockUser | null;
  onLogout: () => void;
  onLanding: () => void;
};

export default function Dashboard({ currentUser, onLogout, onLanding }: Props): JSX.Element {
  const handleLogout = () => {
    authLogout();
    onLogout();
  };

  return (
    <div className="app-root" role="application">
      <aside className="app-sidebar" aria-label="Sidebar">
        <Sidebar />
      </aside>

      <div className="app-right">
        <header className="app-header" aria-label="Top header">
          <Header currentUser={currentUser} onLogout={handleLogout} />
        </header>

        <main className="app-main" aria-label="Main content">
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 16px 0" }}>Welcome back{currentUser ? `, ${currentUser.username}` : ""}!</h2>

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
        </main>
      </div>
    </div>
  );
}
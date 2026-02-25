// src/pages/Dashboard.tsx
import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AccountsCard from "../components/cards/AccountsCard";
import RecentTransactionsCard from "../components/cards/RecentTransactionsCard";
import OverviewCard from "../components/cards/OverviewCard";
import ChartCard from "../components/cards/ChartCard";
import QuickLinksCard from "../components/cards/QuickLinksCard";

import TransactionsList from "./TransactionsList";
import TransactionDetail from "./TransactionDetail";
import AddTransaction from "./AddTransaction";

import type { Transaction } from "../lib/types";
import { sampleTransactions } from "../lib/mockTransactions";
import type { MockUser } from "../lib/auth";

type Props = {
  currentUser: MockUser | null;
  onLogout: () => void;
  onLanding: () => void;
};

type View =
  | { name: "home" }
  | { name: "transactions.list" }
  | { name: "transactions.add"; edit?: Transaction | null }
  | { name: "transactions.detail"; tx: Transaction };

export default function Dashboard({ currentUser, onLogout, onLanding }: Props) {
  // transactions state stored here
  const [transactions, setTransactions] = useState<Transaction[]>(() => sampleTransactions.slice());
  // view state
  const [view, setView] = useState<View>({ name: "home" });

  const activeSidebarKey = useMemo(() => {
    if (view.name.startsWith("transactions")) return view.name;
    return view.name === "home" ? "home" : view.name;
  }, [view]);

  // handlers
  const handleNavigate = (key: string) => {
    if (key === "home") setView({ name: "home" });
    else if (key === "transactions") setView({ name: "transactions.list" });
    else if (key === "transactions.list") setView({ name: "transactions.list" });
    else if (key === "transactions.add") setView({ name: "transactions.add" });
    else setView({ name: "home" });
  };

  const handleAddOrUpdate = (payload: Transaction & { id?: string }) => {
    if (payload.id) {
      // update
      setTransactions((prev) => prev.map((t) => (t.id === payload.id ? { ...t, ...payload } : t)));
    } else {
      // add new
      const newTx = { ...payload, id: String(Date.now()) } as Transaction;
      setTransactions((prev) => [newTx, ...prev]);
    }
    setView({ name: "transactions.list" });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this transaction?")) return;
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEdit = (tx: Transaction) => {
    setView({ name: "transactions.add", edit: tx });
  };

  const handleDetail = (tx: Transaction) => {
    setView({ name: "transactions.detail", tx });
  };

  // main content renderer
  const renderMain = () => {
    switch (view.name) {
      case "home":
        return (
          <>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 16px 0", color: "rgb(var(--accent-rgb))" }}>
              Welcome back{currentUser ? `, ${currentUser.username}` : ""}!
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
      case "transactions.list":
        return (
          <TransactionsList
            transactions={transactions}
            onDetail={handleDetail}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      case "transactions.add":
        return (
          <AddTransaction
            onSave={(data) => {
              // data may include id for edit
              handleAddOrUpdate(data as Transaction);
            }}
            onCancel={() => setView({ name: "transactions.list" })}
            initial={("edit" in view && view.edit) ? view.edit : null}
          />
        );
      case "transactions.detail":
        return <TransactionDetail tx={view.tx} onBack={() => setView({ name: "transactions.list" })} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-root" role="application">
      <aside className="app-sidebar" aria-label="Sidebar">
        <Sidebar active={activeSidebarKey} onNavigate={handleNavigate} />
      </aside>

      <div className="app-right">
        <header className="app-header" aria-label="Top header">
          <Header currentUser={currentUser} onLogout={onLogout} />
        </header>

        <main className="app-main" aria-label="Main content">
          {renderMain()}
        </main>
      </div>
    </div>
  );
}
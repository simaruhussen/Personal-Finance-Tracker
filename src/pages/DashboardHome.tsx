// src/pages/DashboardHome.tsx
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import AccountsCard from "../components/cards/AccountsCard";
import RecentTransactionsCard from "../components/cards/RecentTransactionsCard";
import OverviewCard from "../components/cards/OverviewCard";
import ChartCard from "../components/cards/ChartCard";
import QuickLinksCard from "../components/cards/QuickLinksCard";
import type { DashboardOutletContext } from "./Dashboard";

function useIsSmall(breakpoint = 720) {
  const [isSmall, setIsSmall] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= breakpoint;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);

    const update = () => setIsSmall(mql.matches);
    update();

    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      const matches = "matches" in e ? e.matches : mql.matches;
      setIsSmall(Boolean(matches));
    };

    if (mql.addEventListener) mql.addEventListener("change", handler as EventListener);
    else mql.addListener(handler as any);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handler as EventListener);
      else mql.removeListener(handler as any);
    };
  }, [breakpoint]);

  return isSmall;
}

export default function DashboardHome() {
  const { currentUser } = useOutletContext<DashboardOutletContext>();
  const isSmall = useIsSmall(720);

  // responsive grid styles: desktop shows 3 columns; mobile collapses to single column
  const outerGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isSmall ? "1fr" : "repeat(3, 1fr)",
    gap: 20,
  };

  const leftColumnStyle: React.CSSProperties = {
    gridColumn: isSmall ? "auto" : "span 2",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  };

  const topTwoGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isSmall ? "1fr" : "1fr 1fr",
    gap: 20,
  };

  return (
    <>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 16px 0", color: "rgb(var(--accent-rgb))" }}>
        Welcome back, {currentUser.fullName || currentUser.email}!
      </h2>

      <div style={outerGridStyle}>
        <div style={leftColumnStyle}>
          <div style={topTwoGridStyle}>
            <AccountsCard />
            <RecentTransactionsCard />
          </div>

          <OverviewCard />
        </div>

        {/* right column: only render on desktop / wide screens */}
        {!isSmall && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <ChartCard />
            <QuickLinksCard />
          </div>
        )}
      </div>
    </>
  );
}
// src/pages/DashboardHome.tsx
import React from "react";
import { useOutletContext } from "react-router-dom";
import AccountsCard from "../components/cards/AccountsCard";
import RecentTransactionsCard from "../components/cards/RecentTransactionsCard";
import OverviewCard from "../components/cards/OverviewCard";
import ChartCard from "../components/cards/ChartCard";
import QuickLinksCard from "../components/cards/QuickLinksCard";
import DateRangeFilter from "../components/ui/DateRangeFilter";
import { useDateRange } from "../features/dashboard/DateRangeContext";
import type { DashboardOutletContext } from "./Dashboard";

function useIsSmall(breakpoint = 720) {
  const [isSmall, setIsSmall] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= breakpoint;
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      const matches = "matches" in e ? e.matches : mql.matches;
      setIsSmall(Boolean(matches));
    };

    handler(mql);
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
  const { preset, setPreset, presetLabel } = useDateRange();

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "rgb(var(--accent-rgb))" }}>
          Welcome back, {currentUser.fullName || currentUser.email}!
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ color: "rgba(0,0,0,0.6)", fontSize: 13, marginRight: 8 }}>{presetLabel}</div>
          <DateRangeFilter value={preset} onChange={setPreset} />
        </div>
      </div>

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
// src/features/dashboard/DateRangeContext.tsx
import React, { createContext, useContext, useMemo, useState } from "react";

type DateRange = { from: string | null; to: string | null };
type ContextShape = {
  range: DateRange;
  preset: string;
  setPreset: (p: string) => void;
  presetLabel: string;
};

const DateRangeContext = createContext<ContextShape | null>(null);

/**
 * Helpers: produce ISO strings for local start/end of a day.
 * We use local timezone boundaries (UX-friendly) and return ISO strings.
 */
function startOfDayIsoFromDate(d: Date): string {
  const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  return dt.toISOString();
}
function endOfDayIsoFromDate(d: Date): string {
  const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
  return dt.toISOString();
}

/**
 * DateRangeProvider
 * Presets: "7", "30", "month", "3months", "year", "all"
 * - range.from / range.to are ISO strings (or null for 'all')
 */
export function DateRangeProvider({ children }: { children: React.ReactNode }) {
  const [preset, setPreset] = useState<string>("30");

  const value = useMemo(() => {
    const today = new Date();
    let from: string | null = null;
    let to: string | null = null;
    let label = "All time";

    switch (preset) {
      case "7": {
        const start = new Date();
        start.setDate(today.getDate() - 7);
        from = startOfDayIsoFromDate(start);
        to = endOfDayIsoFromDate(today);
        label = "Last 7 days";
        break;
      }
      case "30": {
        const start = new Date();
        start.setDate(today.getDate() - 30);
        from = startOfDayIsoFromDate(start);
        to = endOfDayIsoFromDate(today);
        label = "Last 30 days";
        break;
      }
      case "month": {
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        from = startOfDayIsoFromDate(start);
        to = endOfDayIsoFromDate(today);
        label = "This month";
        break;
      }
      case "3months": {
        const start = new Date();
        start.setDate(today.getDate() - 90);
        from = startOfDayIsoFromDate(start);
        to = endOfDayIsoFromDate(today);
        label = "Last 3 months";
        break;
      }
      case "year": {
        const start = new Date(today.getFullYear(), 0, 1);
        from = startOfDayIsoFromDate(start);
        to = endOfDayIsoFromDate(today);
        label = "This year";
        break;
      }
      case "all": {
        from = null;
        to = null;
        label = "All time";
        break;
      }
      default: {
        // safe fallback -> last 30 days
        const start = new Date();
        start.setDate(today.getDate() - 30);
        from = startOfDayIsoFromDate(start);
        to = endOfDayIsoFromDate(today);
        label = "Last 30 days";
      }
    }

    return {
      range: { from, to },
      preset,
      setPreset,
      presetLabel: label,
    } as ContextShape;
  }, [preset]);

  return <DateRangeContext.Provider value={value}>{children}</DateRangeContext.Provider>;
}

export function useDateRange() {
  const ctx = useContext(DateRangeContext);
  if (!ctx) throw new Error("useDateRange must be used within DateRangeProvider");
  return ctx;
}
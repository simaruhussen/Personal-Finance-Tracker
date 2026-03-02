import React from "react";

type Option = { value: string; label: string };

const DEFAULT_OPTIONS: Option[] = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "month", label: "This month" },
  { value: "3months", label: "Last 3 months" },
  { value: "year", label: "This year" },
  { value: "all", label: "All time" },
];

export default function DateRangeFilter({ value, onChange, options = DEFAULT_OPTIONS }: { value: string; onChange: (v: string) => void; options?: Option[] }) {
  return (
    <div style={{ display: "inline-block" }}>
      <label htmlFor="date-range-select" style={{ display: "none" }}>Date range</label>
      <div style={{ position: "relative" }}>
        <select
          id="date-range-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            padding: "8px 32px 8px 12px",
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.08)",
            background: "white",
            minWidth: 160,
          }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <div style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
    </div>
  );
}
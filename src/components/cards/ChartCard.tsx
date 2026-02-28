import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useSummaryQuery, queryErrorToMessage } from "../../features/transactions/queries";
import QueryLoadingState from "../ui/QueryLoadingState";
import QueryErrorState from "../ui/QueryErrorState";
import QueryEmptyState from "../ui/QueryEmptyState";

const COLORS = ["rgba(134,173,15,1)", "rgba(223,203,93,1)", "rgba(64,63,62,0.9)", "rgba(105,125,20,1)"];

export default function ChartCard() {
  const { data, isLoading, isError, error, refetch } = useSummaryQuery();

  const chartData = useMemo(
    () =>
      data
        ? Object.entries(data.categoryTotals).map(([category, total]) => ({
            category,
            total,
          }))
        : [],
    [data],
  );

  return (
    <div className="card">
      <h4 style={{ margin: 0, fontWeight: 700, marginBottom: 10 }}>By Category</h4>

      {isLoading && <QueryLoadingState message="Loading chart…" />}

      {isError && (
        <QueryErrorState message={queryErrorToMessage(error)} onRetry={() => refetch()} />
      )}

      {!isLoading && !isError && chartData.length === 0 && (
        <QueryEmptyState message="No category data yet." />
      )}

      {!isLoading && !isError && chartData.length > 0 && (
        <div style={{ width: "100%", height: 180 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="total"
                nameKey="category"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={4}
              >
                {chartData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

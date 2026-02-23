import React, { type JSX } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { category: "Salary", total: 9000 },
  { category: "Food", total: 800 },
  { category: "Subscriptions", total: 300 },
  { category: "Investments", total: 1200 },
];

const COLORS = [
  "rgba(134,173,15,1)",
  "rgba(223,203,93,1)",
  "rgba(64,63,62,0.9)",
  "rgba(105,125,20,1)",
];

export default function ChartCard(): JSX.Element {
  return (
    <div className="card" style={{ padding: 16 }}>
      <h4 style={{ margin: 0, fontWeight: 700, marginBottom: 10 }}>By Category</h4>
      <div style={{ width: "100%", height: 180 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="total" nameKey="category" innerRadius={40} outerRadius={70} paddingAngle={4}>
              {data.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
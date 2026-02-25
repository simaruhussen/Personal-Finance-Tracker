// src/lib/mockTransactions.ts
import type { Transaction } from "./types";
let nextId = 1000;
function genId() { nextId += 1; return String(nextId); }

export const sampleTransactions: Transaction[] = [
  { id: genId(), amount: 500, type: "income", category: "Salary", date: new Date("2025-06-01T08:00:00.000Z").toISOString(), description: "June salary" },
  { id: genId(), amount: -50, type: "expense", category: "Groceries", date: new Date("2025-06-02T10:30:00.000Z").toISOString(), description: "Weekly groceries" },
  { id: genId(), amount: -200, type: "expense", category: "Utilities", date: new Date("2025-06-03T14:00:00.000Z").toISOString(), description: "Electricity bill" },
  { id: genId(), amount: 1000, type: "income", category: "Freelance", date: new Date("2025-06-04T09:00:00.000Z").toISOString(), description: "Project payment" },
  { id: genId(), amount: -120, type: "expense", category: "Transport", date: new Date("2025-06-05T18:00:00.000Z").toISOString(), description: "Taxi" },
];
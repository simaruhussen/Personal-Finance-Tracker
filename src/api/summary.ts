import { http } from "./http";

export type SummaryResponse = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  categoryTotals: Record<string, number>;
};

export async function getSummary(): Promise<SummaryResponse> {
  const res = await http.get<SummaryResponse>("/api/summary");
  return res.data;
}


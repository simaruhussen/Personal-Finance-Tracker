// src/api/summary.ts
import { http } from "./http";

export type SummaryResponse = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  categoryTotals: Record<string, number>;
};

/**
 * Fetch summary with optional date range.
 * @param params Optional object: { from?: string | null, to?: string | null }
 *               Dates should be ISO strings (recommended) or YYYY-MM-DD.
 */
export async function getSummary(params?: { from?: string | null; to?: string | null }): Promise<SummaryResponse> {
  const query: Record<string, string> = {};
  if (params?.from) query.from = params.from;
  if (params?.to) query.to = params.to;
  const res = await http.get<SummaryResponse>("/api/summary", { params: Object.keys(query).length ? query : undefined });
  return res.data;
}
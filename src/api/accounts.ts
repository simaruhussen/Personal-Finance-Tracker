import { http } from "./http";

export type ApiAccount = {
  id: string;
  name: string;
  balance: number | string;
  createdAt?: string;
  updatedAt?: string;
};

export type UpsertAccountInput = {
  name: string;
  balance: number;
};

export type UpsertAccountsRequest = {
  accounts: UpsertAccountInput[];
};

export async function getAccounts(): Promise<ApiAccount[]> {
  const res = await http.get<ApiAccount[]>("/api/accounts");
  return res.data;
}

export async function upsertAccounts(payload: UpsertAccountsRequest): Promise<ApiAccount[]> {
  const res = await http.put<ApiAccount[]>("/api/accounts", payload);
  return res.data;
}


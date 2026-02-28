import { useEffect, useMemo, useState } from "react";
import { useAccountsQuery, useUpsertAccountsMutation } from "./queries";
import type { ApiAccount } from "../../api/accounts";

export type AccountsCardStatus = "loading" | "error" | "empty" | "success";

export type UseAccountsCardStateResult = {
  status: AccountsCardStatus;
  accounts: ApiAccount[];
  totalBalance: number;
  localBalances: Record<string, string>;
  handleChange: (name: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isMutating: boolean;
  error: Error | null;
  refetch: () => void;
  mutationError: Error | null;
};

export function useAccountsCardState(editable: boolean): UseAccountsCardStateResult {
  const { data, isLoading, isError, error, refetch } = useAccountsQuery();
  const upsertMutation = useUpsertAccountsMutation();

  const [localBalances, setLocalBalances] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!data) return;
    setLocalBalances(
      data.reduce<Record<string, string>>((acc, account) => {
        acc[account.name] = String(account.balance ?? 0);
        return acc;
      }, {}),
    );
  }, [data]);

  const accounts = useMemo(() => data ?? [], [data]);

  const totalBalance = useMemo(() => {
    if (accounts.length === 0) return 0;
    return accounts.reduce((sum, account) => {
      const raw = editable ? localBalances[account.name] ?? account.balance : account.balance;
      const num = Number(raw ?? 0);
      return sum + (Number.isFinite(num) ? num : 0);
    }, 0);
  }, [accounts, editable, localBalances]);

  const handleChange = (name: string, value: string) => {
    setLocalBalances((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accounts.length || upsertMutation.isPending) return;
    const toSave = accounts.map((account) => {
      const raw = localBalances[account.name] ?? account.balance;
      const value = Number(raw ?? 0);
      const safeValue = !Number.isFinite(value) || value < 0 ? 0 : value;
      return { name: account.name, balance: safeValue };
    });
    upsertMutation.mutate(toSave);
  };

  const status: AccountsCardStatus = useMemo(() => {
    if (isLoading && !data) return "loading";
    if (isError) return "error";
    if (accounts.length === 0) return "empty";
    return "success";
  }, [isLoading, data, isError, accounts.length]);

  return {
    status,
    accounts,
    totalBalance,
    localBalances,
    handleChange,
    handleSubmit,
    isMutating: upsertMutation.isPending,
    error: error ?? null,
    refetch,
    mutationError: upsertMutation.error ?? null,
  };
}

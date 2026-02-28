import React, { useEffect, useMemo, useState } from "react";
import { useAccountsQuery, useUpsertAccountsMutation, queryErrorToMessage, mutationErrorToMessage } from "../../features/accounts/queries";

type Props = {
  editable?: boolean;
};

type LocalBalances = Record<string, string>;

export default function AccountsCard({ editable = false }: Props) {
  const { data, isLoading, isError, error } = useAccountsQuery();
  const upsertMutation = useUpsertAccountsMutation();

  const [localBalances, setLocalBalances] = useState<LocalBalances>({});

  // Keep local editable state in sync with server data
  useEffect(() => {
    if (!data) return;
    setLocalBalances(
      data.reduce<LocalBalances>((acc, account) => {
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
    setLocalBalances((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    if (!accounts.length || upsertMutation.isPending) return;

    const toSave = accounts.map((account) => {
      const raw = localBalances[account.name] ?? account.balance;
      const value = Number(raw ?? 0);
      const safeValue = !Number.isFinite(value) || value < 0 ? 0 : value;
      return {
        name: account.name,
        balance: safeValue,
      };
    });

    upsertMutation.mutate(toSave);
  };

  const isMutating = upsertMutation.isPending;

  let bodyContent: React.ReactNode;
  if (isLoading && !data) {
    bodyContent = (
      <div style={{ padding: "4px 0", fontSize: 13, color: "rgba(var(--accent-rgb),0.7)" }}>
        Loading accounts…
      </div>
    );
  } else if (isError) {
    bodyContent = (
      <div style={{ padding: "4px 0", fontSize: 13, color: "#b91c1c" }}>
        {queryErrorToMessage(error)}
      </div>
    );
  } else if (!accounts.length) {
    bodyContent = (
      <div style={{ padding: "4px 0", fontSize: 13, color: "rgba(var(--accent-rgb),0.7)" }}>
        No accounts yet. They will be created automatically once you start using the app.
      </div>
    );
  } else {
    bodyContent = (
      <form onSubmit={editable ? handleSubmit : undefined} style={{ display: "grid", gap: 10 }}>
        {accounts.map((account) => {
          const displayValue = editable ? localBalances[account.name] ?? "" : Number(account.balance ?? 0).toLocaleString();

          return (
            <div key={account.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ color: "rgba(var(--accent-rgb),0.85)" }}>{account.name}</div>

              {editable ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={displayValue}
                    onChange={(e) => handleChange(account.name, e.target.value)}
                    aria-label={`${account.name} balance`}
                    style={{
                      width: 120,
                      padding: "4px 8px",
                      borderRadius: 8,
                      border: "1px solid rgba(var(--accent-rgb),0.2)",
                      fontSize: 13,
                      textAlign: "right",
                      color: "rgb(var(--accent-rgb))",
                      background: "rgba(0,0,0,0.02)",
                    }}
                  />
                  <span style={{ fontSize: 12, color: "rgba(var(--accent-rgb),0.7)" }}>birr</span>
                </div>
              ) : (
                <div style={{ fontWeight: 700, color: "rgb(var(--accent-rgb))" }}>
                  {displayValue} birr
                </div>
              )}
            </div>
          );
        })}

        <hr style={{ border: "none", borderTop: "1px solid rgba(var(--accent-rgb),0.06)", margin: "8px 0" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "rgba(var(--accent-rgb),0.85)" }}>Total Balance</div>
          <div style={{ fontWeight: 900, fontSize: 20, color: "rgb(var(--accent-rgb))" }}>
            {Number(totalBalance).toLocaleString()} birr
          </div>
        </div>

        {editable && (
          <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 12, color: "rgba(var(--accent-rgb),0.6)" }}>
              Balances are stored per account and per user.
            </div>
            <button
              type="submit"
              disabled={isMutating}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "none",
                background: isMutating ? "rgba(0,0,0,0.1)" : "rgb(var(--primary-rgb))",
                color: "#fff",
                fontSize: 13,
                cursor: isMutating ? "default" : "pointer",
                boxShadow: "0 4px 10px rgba(var(--primary-rgb),0.35)",
                opacity: isMutating ? 0.8 : 1,
              }}
            >
              {isMutating ? "Saving…" : "Save changes"}
            </button>
          </div>
        )}

        {editable && upsertMutation.isError && (
          <div style={{ marginTop: 6, fontSize: 12, color: "#b91c1c" }}>
            {mutationErrorToMessage(upsertMutation.error)}
          </div>
        )}
      </form>
    );
  }

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "rgb(var(--accent-rgb))" }}>Your Accounts</h3>
        <button
          type="button"
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "none",
            background: "rgba(0,0,0,0.06)",
            color: "rgb(var(--accent-rgb))",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Upgrade plan
        </button>
      </div>

      {bodyContent}
    </div>
  );
}

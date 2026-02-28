import React from "react";
import QueryLoadingState from "../ui/QueryLoadingState";
import QueryErrorState from "../ui/QueryErrorState";
import QueryEmptyState from "../ui/QueryEmptyState";
import type { ApiAccount } from "../../api/accounts";
import type { AccountsCardStatus } from "../../features/accounts/useAccountsCardState";

type Props = {
  status: AccountsCardStatus;
  accounts: ApiAccount[];
  totalBalance: number;
  localBalances: Record<string, string>;
  editable: boolean;
  isMutating: boolean;
  errorMessage: string | null;
  mutationErrorMessage: string | null;
  onRetry: () => void;
  onChangeBalance: (name: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function AccountsCardView({
  status,
  accounts,
  totalBalance,
  localBalances,
  editable,
  isMutating,
  errorMessage,
  mutationErrorMessage,
  onRetry,
  onChangeBalance,
  onSubmit,
}: Props) {
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

      {status === "loading" && <QueryLoadingState message="Loading accounts…" />}

      {status === "error" && errorMessage && (
        <QueryErrorState message={errorMessage} onRetry={onRetry} />
      )}

      {status === "empty" && (
        <QueryEmptyState message="No accounts yet. They will be created automatically once you start using the app." />
      )}

      {status === "success" && (
        <form onSubmit={editable ? onSubmit : undefined} style={{ display: "grid", gap: 10 }}>
          {accounts.map((account) => {
            const displayValue = editable
              ? localBalances[account.name] ?? ""
              : Number(account.balance ?? 0).toLocaleString();

            return (
              <div
                key={account.id}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}
              >
                <div style={{ color: "rgba(var(--accent-rgb),0.85)" }}>{account.name}</div>

                {editable ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={displayValue}
                      onChange={(e) => onChangeBalance(account.name, e.target.value)}
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

          {editable && mutationErrorMessage && (
            <div style={{ marginTop: 6, fontSize: 12, color: "#b91c1c" }}>{mutationErrorMessage}</div>
          )}
        </form>
      )}
    </div>
  );
}

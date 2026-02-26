import { useCallback, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import TransactionsList from "./TransactionsList";
import type { DashboardOutletContext } from "./Dashboard";
import type { Transaction } from "../lib/types";
import { useTransactionsQuery, queryErrorToMessage } from "../features/transactions/queries";
import { useDeleteTransactionMutation } from "../features/transactions/mutations";
import ConfirmDialog from "../components/ConfirmDialog";

export default function TransactionsRoute() {
  const { currentUser } = useOutletContext<DashboardOutletContext>();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useTransactionsQuery();
  const deleteMutation = useDeleteTransactionMutation();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const openDeleteDialog = useCallback((id: string) => {
    setPendingDeleteId(id);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setPendingDeleteId(null);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!pendingDeleteId) return;
    deleteMutation.mutate(pendingDeleteId, {
      onSettled: () => {
        setPendingDeleteId(null);
      },
    });
  }, [deleteMutation, pendingDeleteId]);

  const handleEdit = useCallback(
    (tx: Transaction) => {
      navigate("/transactions/new", { state: { editId: tx.id } });
    },
    [navigate]
  );

  const handleDetail = useCallback(
    (tx: Transaction) => {
      navigate(`/transactions/${encodeURIComponent(tx.id)}`);
    },
    [navigate]
  );

  if (!currentUser) return null;

  if (isLoading) {
    return (
      <div className="card" style={{ padding: 18 }}>
        <div style={{ color: "rgba(var(--accent-rgb),0.7)" }}>Loading transactions…</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card" style={{ padding: 18 }}>
        <div style={{ color: "#b91c1c" }}>{queryErrorToMessage(error)}</div>
        <button className="auth-ghost" style={{ marginTop: 10 }} onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  const transactions = data ?? [];

  return (
    <>
      <TransactionsList
        transactions={transactions}
        onDetail={handleDetail}
        onEdit={handleEdit}
        onDelete={openDeleteDialog}
      />

      <ConfirmDialog
        open={!!pendingDeleteId}
        title="Delete transaction"
        message="Are you sure you want to delete this transaction?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={closeDeleteDialog}
      />
    </>
  );
}


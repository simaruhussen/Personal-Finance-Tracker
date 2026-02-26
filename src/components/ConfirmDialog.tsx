type Props = {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title = "Confirm",
  message = "Are you sure?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          background: "white",
          borderRadius: 8,
          width: 420,
          maxWidth: "90%",
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
          padding: 20,
        }}
      >
        <h3 style={{ margin: 0, marginBottom: 8 }}>{title}</h3>
        <p style={{ marginTop: 0, marginBottom: 16, color: "rgba(0,0,0,0.7)" }}>{message}</p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            {cancelLabel}
          </button>

          <button
            onClick={onConfirm}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "none",
              background: "rgb(220,60,60)",
              color: "white",
              cursor: "pointer",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}


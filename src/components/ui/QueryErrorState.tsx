import React from "react";

type Props = {
  message: string;
  onRetry?: () => void;
};

export default function QueryErrorState({ message, onRetry }: Props) {
  return (
    <div style={{ padding: 8, color: "#b91c1c", fontSize: 13 }}>
      <div>{message}</div>
      {onRetry && (
        <button
          type="button"
          className="auth-ghost"
          style={{ marginTop: 8 }}
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  );
}


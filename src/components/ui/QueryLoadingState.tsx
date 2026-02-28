import React from "react";

type Props = {
  message?: string;
};

export default function QueryLoadingState({ message = "Loading…" }: Props) {
  return (
    <div style={{ padding: 8, color: "rgba(var(--accent-rgb),0.6)", fontSize: 13 }}>
      {message}
    </div>
  );
}


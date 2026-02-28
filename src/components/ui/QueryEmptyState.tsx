import React from "react";

type Props = {
  message: string;
};

export default function QueryEmptyState({ message }: Props) {
  return (
    <div style={{ padding: 8, color: "rgba(var(--accent-rgb),0.7)", fontSize: 13 }}>
      {message}
    </div>
  );
}


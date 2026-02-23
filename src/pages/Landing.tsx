import React, { type JSX } from "react";

type Props = {
  onSignIn: () => void;
  onGetStarted: () => void;
};

export default function Landing({ onSignIn, onGetStarted }: Props): JSX.Element {
  return (
    <div className="signup-root" role="main">
      <div className="signup-left-bleed" aria-hidden />

      <div className="signup-card card" style={{ textAlign: "center" }}>
        <h1 className="signup-title">FinanceTr</h1>

        <p style={{ color: "rgba(0,0,0,0.6)", marginBottom: 18 }}>Track income, expenses and visualize your finances.</p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 18 }}>
          <button className="signup-btn" onClick={onSignIn}>Sign in</button>
          <button className="signup-ghost" onClick={onGetStarted}>Get started</button>
        </div>

        <div style={{ marginTop: 18, color: "rgba(0,0,0,0.45)" }}>
          New here? Click Get started to create an account.
        </div>
      </div>

      <div className="signup-illustration" aria-hidden>
        <svg width="320" height="240" viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration">
          <rect x="0" y="0" width="320" height="240" rx="8" fill="rgba(0,0,0,0.03)"/>
          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="rgba(64,63,62,0.25)" font-size="18">Illustration</text>
        </svg>
      </div>
    </div>
  );
}
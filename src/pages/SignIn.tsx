// src/pages/SignIn.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { findUserByCredentials, setCurrentUser } from "../lib/auth";
import type { MockUser } from "../lib/auth";

type Props = {
  onSignedIn: (user: MockUser) => void;
  onGoToSignup: () => void;
};

type FormValues = {
  email: string;
  password: string;
};

export default function SignIn({ onSignedIn, onGoToSignup }: Props): JSX.Element {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { email: "", password: "" },
  });
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (data: FormValues) => {
    setError(null);
    const user = findUserByCredentials(data.email, data.password);
    if (!user) {
      setError("Invalid credentials. If you don't have an account click Get started.");
      return;
    }
    setCurrentUser(user);
    onSignedIn(user);
  };

  return (
    <div className="auth-root" role="main">
      <div className="auth-left-bleed" aria-hidden />

      {/* Card: centered content vertically and horizontally */}
      <div
        className="auth-card card"
        role="region"
        aria-label="Sign in"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",     // center vertically
          position: "relative",
          minHeight: 420,               // ensures vertical centering space
        }}
      >
        <h1 className="auth-title">Sign in</h1>

        <form
          className="auth-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          style={{
            width: "100%",
            maxWidth: 420,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "0 auto",           // center horizontally
          }}
        >
          <div style={{ width: "100%" }}>
            <label className="auth-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="auth-input"
              {...register("email", { required: "Email is required" })}
              placeholder="you@example.com"
              style={{ width: "100%" }}
            />
            {formState.errors.email && <div style={{ color: "#b91c1c", fontSize: 13 }}>{String(formState.errors.email.message)}</div>}
          </div>

          <div style={{ width: "100%", marginTop: 6 }}>
            <label className="auth-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="auth-input"
              {...register("password", { required: "Password is required" })}
              placeholder="••••••••"
              style={{ width: "100%" }}
            />
            {formState.errors.password && <div style={{ color: "#b91c1c", fontSize: 13 }}>{String(formState.errors.password.message)}</div>}
          </div>

          {/* Forgot? on top-right of the button area */}
          <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
            <button
              type="button"
              onClick={() => alert("Forgot password flow (not implemented)")}
              className="auth-ghost"
              style={{ padding: "8px 12px", borderRadius: 16 }}
            >
              Forgot?
            </button>
          </div>

          {/* Sign in button (wide & centered) */}
          <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: 8 }}>
            <button
              type="submit"
              className="auth-btn"
              style={{ width: 360, maxWidth: "100%", display: "inline-flex", justifyContent: "center" }}
            >
              Sign in
            </button>
          </div>

          {error && <div style={{ color: "#b91c1c", fontSize: 13, width: "100%", textAlign: "center", marginTop: 10 }}>{error}</div>}

          {/* bottom-right single inline unit: "Don't have an account? Get started" */}
          <div style={{ width: "100%", marginTop: 16, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
            <div style={{ color: "rgba(0,0,0,0.6)", fontSize: 14, marginRight: 6 }}>Don't have an account?</div>
            <button
              type="button"
              className="auth-ghost"
              onClick={onGoToSignup}
              style={{ padding: "10px 16px", borderRadius: 20 }}
            >
              Get started
            </button>
          </div>
        </form>
      </div>

      <div className="auth-illustration" aria-hidden>
        
      </div>
    </div>
  );
}
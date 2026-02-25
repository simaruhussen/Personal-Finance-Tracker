import React, { useState, type JSX } from "react";
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

      <div
        className="auth-card card"
        role="region"
        aria-label="Sign in"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          minHeight: 420,
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
            margin: "0 auto",
            color: "rgb(var(--accent-rgb))",
          }}
        >
          <div style={{ width: "100%" }}>
            <label className="auth-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="auth-input"
              {...register("email", { required: "Email is required" })}
              placeholder="you@example.com"
              style={{ width: "100%", color: "rgb(var(--accent-rgb))" }}
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
              style={{ width: "100%", color: "rgb(var(--accent-rgb))" }}
            />
            {formState.errors.password && <div style={{ color: "#b91c1c", fontSize: 13 }}>{String(formState.errors.password.message)}</div>}
          </div>

          {/* Forgot? above the button */}
          <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
            <button
              type="button"
              onClick={() => alert("Forgot password flow (not implemented)")}
              className="auth-ghost"
              style={{ padding: "8px 12px", borderRadius: 16, color: "rgb(var(--accent-rgb))" }}
            >
              Forgot?
            </button>
          </div>

          {/* Sign in button */}
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

          {/* bottom-right single inline unit using CSS variable based color */}
          <div style={{ width: "100%", marginTop: 16, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
            <div style={{ color: "rgba(var(--accent-rgb),0.85)", fontSize: 14, marginRight: 6 }}>Don't have an account?</div>
            <button
              type="button"
              className="auth-ghost"
              onClick={onGoToSignup}
              style={{ padding: "10px 16px", borderRadius: 20, color: "rgb(var(--accent-rgb))" }}
            >
              Get started
            </button>
          </div>
        </form>
      </div>

      <div className="auth-illustration" aria-hidden>
        <svg width="320" height="240" viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration">
          <rect x="0" y="0" width="320" height="240" rx="8" fill="rgba(0,0,0,0.03)"/>
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="rgba(var(--accent-rgb),0.25)" fontSize="18">Illustration</text>
        </svg>
      </div>
    </div>
  );
}
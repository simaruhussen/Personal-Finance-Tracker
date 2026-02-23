// src/pages/SignUp.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createUser, findUserByEmail, setCurrentUser } from "../lib/auth";
import type { MockUser } from "../lib/auth";

type Props = {
  onSignedUp: (user: MockUser) => void;
  onBack: () => void;
};

type FormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUp({ onSignedUp, onBack }: Props): JSX.Element {
  const { register, handleSubmit, watch, formState } = useForm<FormValues>({
    defaultValues: { username: "", email: "", password: "", confirmPassword: "" },
  });
  const [error, setError] = useState<string | null>(null);

  const password = watch("password");

  const onSubmit = (data: FormValues) => {
    setError(null);

    if (!data.email) {
      setError("Email is required.");
      return;
    }
    if (!data.password || data.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (findUserByEmail(data.email)) {
      setError("An account with this email already exists. Please sign in.");
      return;
    }

    const user = createUser({ username: data.username || data.email, email: data.email, password: data.password });
    setCurrentUser(user);
    onSignedUp(user);
  };

  return (
    <div className="auth-root" role="main">
      <div className="auth-left-bleed" aria-hidden />

      {/* Card: center the form vertically & horizontally */}
      <div
        className="auth-card card"
        role="region"
        aria-label="Sign up"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",   // vertical center
          position: "relative",
          minHeight: 480,             // gives space for centering
        }}
      >
        <h1 className="auth-title">Create account</h1>

        <form
          className="auth-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          style={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", alignItems: "center", margin: "0 auto" }}
        >
          <div style={{ width: "100%" }}>
            <label className="auth-label" htmlFor="username">Full name</label>
            <input id="username" className="auth-input" {...register("username")} placeholder="Your name" />
          </div>

          <div style={{ width: "100%" }}>
            <label className="auth-label" htmlFor="email">Email</label>
            <input id="email" className="auth-input" {...register("email", { required: true })} placeholder="you@example.com" />
            {formState.errors.email && <div style={{ color: "#b91c1c", fontSize: 13 }}>Email is required</div>}
          </div>

          <div style={{ width: "100%" }}>
            <label className="auth-label" htmlFor="password">Password</label>
            <input id="password" type="password" className="auth-input" {...register("password", { required: true, minLength: 6 })} placeholder="At least 6 characters" />
            {formState.errors.password && <div style={{ color: "#b91c1c", fontSize: 13 }}>Password is required (min 6 chars)</div>}
          </div>

          <div style={{ width: "100%" }}>
            <label className="auth-label" htmlFor="confirmPassword">Confirm password</label>
            <input id="confirmPassword" type="password" className="auth-input" {...register("confirmPassword", { required: true })} placeholder="Repeat password" />
          </div>

          {error && <div style={{ color: "#b91c1c", fontSize: 13, width: "100%", textAlign: "center", marginTop: 8 }}>{error}</div>}

          {/* Sign up button centered & wide */}
          <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: 10 }}>
            <button
              type="submit"
              className="auth-btn"
              style={{ width: 360, maxWidth: "100%", display: "inline-flex", justifyContent: "center" }}
            >
              Sign up
            </button>
          </div>

          {/* bottom-right footer: Already have an account? Sign in */}
          <div style={{ width: "100%", marginTop: 16, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
            <div style={{ color: "rgba(0,0,0,0.6)", fontSize: 14, marginRight: 6 }}>Already have an account?</div>
            <button
              type="button"
              className="auth-ghost"
              onClick={onBack}
              style={{ padding: "10px 16px", borderRadius: 20 }}
            >
              Sign in
            </button>
          </div>
        </form>
      </div>

      <div className="auth-illustration" aria-hidden>
      </div>
    </div>
  );
}
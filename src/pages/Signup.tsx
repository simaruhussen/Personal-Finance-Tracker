import React, { useState, type JSX } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { mutationErrorToMessage, useRegisterMutation } from "../features/auth/mutations";

type FormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUp(): JSX.Element {
  const { register, handleSubmit, watch, formState } = useForm<FormValues>({
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });
  const [error, setError] = useState<string | null>(null);
  const registerMutation = useRegisterMutation();
  const navigate = useNavigate();

  const password = watch("password");

  const onSubmit = async (data: FormValues) => {
    setError(null);
    if (!data.fullName) {
      setError("Full name is required.");
      return;
    }
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
    try {
      await registerMutation.mutateAsync({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
      navigate("/", { replace: true });
    } catch (err) {
      setError(mutationErrorToMessage(err));
    }
  };

  return (
    <div className="auth-root" role="main">
      <div className="auth-left-bleed" aria-hidden />

      <div
        className="auth-card card"
        role="region"
        aria-label="Sign up"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          minHeight: 480,
        }}
      >
        <h1 className="auth-title">Create account</h1>

        <form
          className="auth-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          style={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", alignItems: "center", margin: "0 auto", color: "rgb(var(--accent-rgb))" }}
        >
          <div style={{ width: "100%" }}>
            <label className="auth-label" htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              className="auth-input"
              {...register("fullName", { required: true })}
              placeholder="Your name"
              style={{ color: "rgb(var(--accent-rgb))" }}
            />
            {formState.errors.fullName && (
              <div style={{ color: "#b91c1c", fontSize: 13 }}>Full name is required</div>
            )}
          </div>

          <div style={{ width: "100%" }}>
            <label className="auth-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="auth-input"
              {...register("email", { required: true })}
              placeholder="you@example.com"
              style={{ color: "rgb(var(--accent-rgb))" }}
            />
            {formState.errors.email && (
              <div style={{ color: "#b91c1c", fontSize: 13 }}>Email is required</div>
            )}
          </div>

          <div style={{ width: "100%" }}>
            <label className="auth-label" htmlFor="password">Password</label>
            <input id="password" type="password" className="auth-input" {...register("password", { required: true, minLength: 6 })} placeholder="At least 6 characters" style={{ color: "rgb(var(--accent-rgb))" }} />
            {formState.errors.password && <div style={{ color: "#b91c1c", fontSize: 13 }}>Password is required (min 6 chars)</div>}
          </div>

          <div style={{ width: "100%" }}>
            <label className="auth-label" htmlFor="confirmPassword">Confirm password</label>
            <input id="confirmPassword" type="password" className="auth-input" {...register("confirmPassword", { required: true })} placeholder="Repeat password" style={{ color: "rgb(var(--accent-rgb))" }} />
          </div>

          {(error || registerMutation.error) && (
            <div style={{ color: "#b91c1c", fontSize: 13, width: "100%", textAlign: "center", marginTop: 8 }}>
              {error ?? mutationErrorToMessage(registerMutation.error)}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: 10 }}>
            <button
              type="submit"
              className="auth-btn"
              style={{ width: 360, maxWidth: "100%", display: "inline-flex", justifyContent: "center" }}
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Creating account…" : "Sign up"}
            </button>
          </div>

          <div style={{ width: "100%", marginTop: 16, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
            <div style={{ color: "rgba(var(--accent-rgb),0.85)", fontSize: 14, marginRight: 6 }}>Already have an account?</div>
            <button
              type="button"
              className="auth-ghost"
              onClick={() => navigate("/login")}
              style={{ padding: "10px 16px", borderRadius: 20, color: "rgb(var(--accent-rgb))" }}
            >
              Sign in
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
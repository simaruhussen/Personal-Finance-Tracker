// src/components/SignUp.tsx
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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUp(): JSX.Element {
  const {
    register,
    handleSubmit,
    watch,
    formState,
    setError: setFormError,
  } = useForm<FormValues>({
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
    mode: "onBlur",
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const registerMutation = useRegisterMutation();
  const navigate = useNavigate();

  const password = watch("password");

  const parseAndApplyServerErrors = (err: any) => {
    // Common locations for server response
    const data = err?.response?.data ?? err?.data ?? err;

    // If server returns an array of validation errors (like the example you posted)
    if (Array.isArray(data) && data.length > 0) {
      let attached = false;
      data.forEach((e: any) => {
        const path = Array.isArray(e.path) && e.path.length > 0 ? e.path[0] : null;
        const message = e.message ?? e.msg ?? "Invalid value";
        if (path && (["email", "fullName", "password", "confirmPassword"] as string[]).includes(path)) {
          // Attach to the specific field
          setFormError(path as keyof FormValues, { type: "server", message });
          attached = true;
        }
      });
      if (!attached) {
        // No field-level path found — show the first message as general server error
        setServerError(data[0]?.message ?? JSON.stringify(data));
      }
      return;
    }

    // If server returns { message: "..." }
    if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
      setServerError(data.message);
      return;
    }

    // Fallback to string or stringify
    if (typeof data === "string") {
      setServerError(data);
      return;
    }

    setServerError(JSON.stringify(data));
  };

  const onSubmit = async (data: FormValues) => {
    // Clear previous server errors
    setServerError(null);

    try {
      await registerMutation.mutateAsync({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
      navigate("/login", { replace: true });
    } catch (err) {
      // Attempt to use centralized mapper first, but still parse common shapes here
      try {
        const mapped = mutationErrorToMessage(err);
        // If mutationErrorToMessage returns something sensible, show it as general server error
        if (mapped && typeof mapped === "string" && mapped.length > 0) {
          setServerError(mapped);
        } else {
          // If not helpful, parse known shapes
          parseAndApplyServerErrors(err);
        }
      } catch {
        parseAndApplyServerErrors(err);
      }
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
            <label className="auth-label" htmlFor="fullName">User Name</label>
            <input
              id="fullName"
              className="auth-input"
              aria-invalid={!!formState.errors.fullName}
              {...register("fullName", { required: "Full name is required." })}
              placeholder="Your name"
              style={{ color: "rgb(var(--accent-rgb))" }}
            />
            {formState.errors.fullName && (
              <div role="alert" style={{ color: "#b91c1c", fontSize: 13 }}>
                {formState.errors.fullName.message as string}
              </div>
            )}
          </div>

          <div style={{ width: "100%" }}>
            <label className="auth-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="auth-input"
              aria-invalid={!!formState.errors.email}
              {...register("email", {
                required: "Email is required.",
                pattern: { value: EMAIL_REGEX, message: "Invalid email address." },
                maxLength: { value: 254, message: "Email is too long." },
              })}
              placeholder="you@example.com"
              style={{ color: "rgb(var(--accent-rgb))" }}
            />
            {formState.errors.email && (
              <div role="alert" style={{ color: "#b91c1c", fontSize: 13 }}>
                {formState.errors.email.message as string}
              </div>
            )}
          </div>

          <div style={{ width: "100%" }}>
            <label className="auth-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="auth-input"
              aria-invalid={!!formState.errors.password}
              {...register("password", {
                required: "Password is required.",
                minLength: { value: 6, message: "Password must be at least 6 characters." },
              })}
              placeholder="At least 6 characters"
              style={{ color: "rgb(var(--accent-rgb))" }}
            />
            {formState.errors.password && (
              <div role="alert" style={{ color: "#b91c1c", fontSize: 13 }}>
                {formState.errors.password.message as string}
              </div>
            )}
          </div>

          <div style={{ width: "100%" }}>
            <label className="auth-label" htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              className="auth-input"
              aria-invalid={!!formState.errors.confirmPassword}
              {...register("confirmPassword", {
                required: "Please confirm your password.",
                validate: (value) => value === password || "Passwords do not match.",
              })}
              placeholder="Repeat password"
              style={{ color: "rgb(var(--accent-rgb))" }}
            />
            {formState.errors.confirmPassword && (
              <div role="alert" style={{ color: "#b91c1c", fontSize: 13 }}>
                {formState.errors.confirmPassword.message as string}
              </div>
            )}
          </div>

          {(serverError || registerMutation.error) && (
            <div
              role="alert"
              style={{
                color: "#b91c1c",
                fontSize: 13,
                width: "100%",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              {serverError ?? mutationErrorToMessage(registerMutation.error)}
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
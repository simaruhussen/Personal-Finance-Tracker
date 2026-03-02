// src/components/SignIn.tsx
import React, { useMemo, useState, type JSX } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { mutationErrorToMessage, useLoginMutation } from "../features/auth/mutations";

type FormValues = {
  email: string;
  password: string;
};

const RFC_EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

export default function SignIn(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState,
    setError,
    clearErrors,
  } = useForm<FormValues>({
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const loginMutation = useLoginMutation();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const from = useMemo(() => {
    const state = location.state as { from?: unknown } | null;
    return typeof state?.from === "string" ? state.from : "/";
  }, [location.state]);

  const parseAndApplyServerErrors = (err: any) => {
    // Reset any previous server-wide error
    setServerError(null);

    // Try centralized normalizer first (if implemented)
    try {
      const normalized = mutationErrorToMessage(err);
      if (normalized && typeof normalized === "object") {
        const fieldErrors = (normalized as any).fieldErrors;
        const message = (normalized as any).message;
        if (Array.isArray(fieldErrors) && fieldErrors.length) {
          fieldErrors.forEach((fe: any) => {
            if (fe?.path) {
              setError(fe.path as keyof FormValues, { type: "server", message: String(fe.message ?? fe) });
            }
          });
          return;
        }
        if (typeof message === "string" && message.length) {
          setServerError(message);
          return;
        }
      }
    } catch {
      // ignore and fall back to generic parsing
    }

    // Defensive extraction of server payload
    const data = err?.response?.data ?? err?.data ?? err;

    // If server returned an array of validation errors (your example)
    if (Array.isArray(data) && data.length > 0) {
      let attached = false;
      data.forEach((e: any) => {
        // path may be ["password"] or "password" or e.field
        const path =
          (Array.isArray(e.path) && e.path.length ? e.path[0] : e.path) ??
          e.field ??
          null;

        // Friendly mapping for known codes
        let message = e.message ?? e.msg ?? e.error ?? "Invalid value";
        if (e.code === "too_small" && typeof e.minimum === "number") {
          message = `Must be at least ${e.minimum} characters.`;
        } else if (e.code === "invalid_format" && e.format === "email") {
          message = "Invalid email address.";
        } else if (typeof message === "string") {
          // leave as is
        } else {
          message = String(message);
        }

        if (path && (["email", "password"] as string[]).includes(String(path))) {
          setError(path as keyof FormValues, { type: "server", message });
          attached = true;
        }
      });

      if (!attached) {
        // Nothing attached to a field: show friendly banner using first message
        setServerError(String(data[0]?.message ?? JSON.stringify(data)));
      }
      return;
    }

    // { errors: { email: "..." } } style
    if (data && typeof data === "object" && data.errors && typeof data.errors === "object") {
      let attached = false;
      Object.entries(data.errors).forEach(([k, v]) => {
        const msg = Array.isArray(v) ? String(v[0]) : String(v);
        if ((["email", "password"] as string[]).includes(k)) {
          setError(k as keyof FormValues, { type: "server", message: msg });
          attached = true;
        }
      });
      if (!attached) {
        setServerError("Validation failed. Please check your input.");
      }
      return;
    }

    // { message: "..." } shape
    if (data && typeof data === "object" && typeof data.message === "string") {
      setServerError(data.message);
      return;
    }

    if (typeof data === "string") {
      setServerError(data);
      return;
    }

    setServerError("An unexpected error occurred. Please try again.");
  };

  const onSubmit = async (data: FormValues) => {
    // Clear previous field & server errors
    clearErrors();
    setServerError(null);

    try {
      await loginMutation.mutateAsync({ email: data.email, password: data.password });
      navigate(from, { replace: true });
    } catch (err) {
      parseAndApplyServerErrors(err);
    }
  };

  // If loginMutation.error exists and hasn't been attached to fields, show normalized message
  const getMutationBanner = () => {
    if (!loginMutation.error) return null;
    try {
      const normalized = mutationErrorToMessage(loginMutation.error);
      if (normalized && typeof normalized === "object" && (normalized as any).message) {
        return (normalized as any).message;
      }
    } catch {
      // ignore
    }
    // Fallback to simple string
    if (typeof loginMutation.error === "string") return loginMutation.error;
    return "Sign in failed. Please check your credentials.";
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
              type="email"
              className="auth-input"
              {...register("email", {
                required: "Email is required",
                pattern: { value: RFC_EMAIL_REGEX, message: "Please enter a valid email address." },
                maxLength: { value: 254, message: "Email is too long." },
              })}
              placeholder="you@example.com"
              style={{ width: "100%", color: "rgb(var(--accent-rgb))" }}
              aria-invalid={!!formState.errors.email}
            />
            {formState.errors.email && (
              <div style={{ color: "#b91c1c", fontSize: 13 }}>
                {String(formState.errors.email.message)}
              </div>
            )}
          </div>

          <div style={{ width: "100%", marginTop: 6 }}>
            <label className="auth-label" htmlFor="password">Password</label>

            <div style={{ position: "relative", width: "100%" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="auth-input"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters." },
                })}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  color: "rgb(var(--accent-rgb))",
                  paddingRight: 44,
                }}
                aria-describedby={formState.errors.password ? "password-error" : undefined}
                aria-invalid={!!formState.errors.password}
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="auth-ghost"
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  height: 32,
                  width: 32,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                  padding: 4,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "rgb(var(--accent-rgb))",
                }}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            {formState.errors.password && (
              <div id="password-error" style={{ color: "#b91c1c", fontSize: 13 }}>
                {String(formState.errors.password.message)}
              </div>
            )}
          </div>

          {(serverError || loginMutation.error) && (
            <div style={{ color: "#b91c1c", fontSize: 13, width: "100%", textAlign: "center", marginTop: 10 }}>
              {serverError ?? getMutationBanner()}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: 24 }}>
            <button
              type="submit"
              className="auth-btn"
              style={{ width: 360, maxWidth: "100%", display: "inline-flex", justifyContent: "center" }}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in…" : "Sign in"}
            </button>
          </div>

          <div style={{ width: "100%", marginTop: 16, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
            <div style={{ color: "rgba(var(--accent-rgb),0.85)", fontSize: 14, marginRight: 6 }}>Don't have an account?</div>
            <button
              type="button"
              className="auth-ghost"
              onClick={() => navigate("/register")}
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
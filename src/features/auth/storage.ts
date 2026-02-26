import type { AuthSession } from "./types";

const AUTH_SESSION_KEY = "pft_auth_session";

export function readAuthSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { token?: unknown; user?: unknown };
    if (typeof parsed.token !== "string") return null;
    if (!parsed.user || typeof parsed.user !== "object") return null;
    const user = parsed.user as { id?: unknown; fullName?: unknown; email?: unknown };
    if (typeof user.id !== "string" || typeof user.fullName !== "string" || typeof user.email !== "string") return null;
    return { token: parsed.token, user: { id: user.id, fullName: user.fullName, email: user.email } };
  } catch {
    return null;
  }
}

export function writeAuthSession(session: AuthSession) {
  try {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
}

export function clearAuthSession() {
  try {
    localStorage.removeItem(AUTH_SESSION_KEY);
  } catch {
    // ignore
  }
}

export function getAuthToken(): string | null {
  return readAuthSession()?.token ?? null;
}


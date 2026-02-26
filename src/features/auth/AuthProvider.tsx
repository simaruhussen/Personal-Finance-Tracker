import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { AuthSession, User } from "./types";
import { clearAuthSession, readAuthSession, writeAuthSession } from "./storage";

type AuthContextValue = {
  session: AuthSession | null;
  user: User | null;
  token: string | null;
  setSession: (session: AuthSession | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(() => readAuthSession());

  const setSession = useCallback((next: AuthSession | null) => {
    setSessionState(next);
    if (next) writeAuthSession(next);
    else clearAuthSession();
  }, []);

  const logout = useCallback(() => {
    setSession(null);
  }, [setSession]);

  const value = useMemo<AuthContextValue>(() => {
    return {
      session,
      user: session?.user ?? null,
      token: session?.token ?? null,
      setSession,
      logout,
    };
  }, [session, setSession, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


import { useMutation } from "@tanstack/react-query";
import { login, register } from "../../api/auth";
import { getErrorMessage } from "../../api/errors";
import { useAuth } from "./AuthProvider";
import type { AuthSession } from "./types";

export function useLoginMutation() {
  const { setSession } = useAuth();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      const session: AuthSession = { token: data.token, user: data.user };
      setSession(session);
    },
  });
}

export function useRegisterMutation() {
  const { setSession } = useAuth();
  return useMutation({
    mutationFn: async (payload: { fullName: string; email: string; password: string }) => {
      await register(payload);
      return await login({ email: payload.email, password: payload.password });
    },
    onSuccess: (data) => {
      const session: AuthSession = { token: data.token, user: data.user };
      setSession(session);
    },
  });
}

export function mutationErrorToMessage(error: unknown): string {
  return getErrorMessage(error);
}


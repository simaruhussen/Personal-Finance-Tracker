import axios from "axios";

type BackendErrorPayload =
  | { message?: unknown; status?: unknown }
  | { error?: unknown; message?: unknown }
  | undefined;

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as BackendErrorPayload;
    const message = typeof data?.message === "string" ? data.message : null;
    if (message) return message;
    if (error.response?.status === 401) return "Unauthorized. Please sign in again.";
    if (error.message) return error.message;
    return "Request failed.";
  }

  if (error instanceof Error) return error.message;
  return "Something went wrong.";
}


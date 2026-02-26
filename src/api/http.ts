import axios from "axios";
import { getAuthToken } from "../features/auth/storage";

export const http = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "",
});

http.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

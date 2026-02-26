import { http } from "./http";

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  message: string;
  userId: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: { id: string; fullName: string; email: string };
};

export async function register(payload: RegisterRequest): Promise<RegisterResponse> {
  const res = await http.post<RegisterResponse>("/api/auth/register", payload);
  return res.data;
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const res = await http.post<LoginResponse>("/api/auth/login", payload);
  return res.data;
}


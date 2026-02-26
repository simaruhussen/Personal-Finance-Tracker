export type User = {
  id: string;
  fullName: string;
  email: string;
};

export type AuthSession = {
  token: string;
  user: User;
};


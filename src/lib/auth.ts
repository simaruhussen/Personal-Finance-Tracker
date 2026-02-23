export type MockUser = {
  id: string;
  username: string;
  email: string;
  password: string; // plaintext for mock only — DO NOT use in production
};

const USERS_KEY = "mock_users";
const CURRENT_KEY = "currentUser";

export function getUsers(): MockUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as MockUser[];
  } catch {
    return [];
  }
}

export function setUsers(users: MockUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function createUser(payload: { username: string; email: string; password: string }): MockUser {
  const users = getUsers();
  const id = Date.now().toString();
  const user: MockUser = { id, username: payload.username, email: payload.email, password: payload.password };
  users.push(user);
  setUsers(users);
  return user;
}

export function findUserByCredentials(email: string, password: string): MockUser | undefined {
  const users = getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
}

export function findUserByEmail(email: string): MockUser | undefined {
  const users = getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function setCurrentUser(user: MockUser | null) {
  if (!user) localStorage.removeItem(CURRENT_KEY);
  else localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
}

export function getCurrentUser(): MockUser | null {
  try {
    const raw = localStorage.getItem(CURRENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MockUser;
  } catch {
    return null;
  }
}

export function logout() {
  setCurrentUser(null);
}
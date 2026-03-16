export interface StoredUser {
  username: string;
  password: string;
  name: string;
}

export interface CurrentUser {
  username: string;
  name: string;
}

const USERS_KEY = "tl_users";
const CURRENT_USER_KEY = "tl_current_user";

function getUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser(
  name: string,
  username: string,
  password: string,
): { ok: true } | { err: string } {
  if (!name.trim() || !username.trim() || !password.trim())
    return { err: "All fields are required." };
  const users = getUsers();
  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return { err: "Username already taken. Please choose another." };
  }
  users.push({ username: username.trim(), password, name: name.trim() });
  saveUsers(users);
  return { ok: true };
}

export function loginUser(
  username: string,
  password: string,
): { ok: true } | { err: string } {
  const users = getUsers();
  const user = users.find(
    (u) =>
      u.username.toLowerCase() === username.toLowerCase() &&
      u.password === password,
  );
  if (!user) return { err: "Invalid username or password." };
  const current: CurrentUser = { username: user.username, name: user.name };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(current));
  return { ok: true };
}

export function logoutUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUser(): CurrentUser | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

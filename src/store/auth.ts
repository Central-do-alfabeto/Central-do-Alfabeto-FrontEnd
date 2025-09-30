const TOKEN_KEY = "authToken";
const ROLE_KEY = "authRole";
const USER_ID_KEY = "authUserId";

type UserRole = "STUDENT" | "EDUCATOR";

type AuthSession = {
  token: string;
  role: UserRole;
  userId: number;
};

export function setAuthSession({ token, role, userId }: AuthSession) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(ROLE_KEY, role);
  sessionStorage.setItem(USER_ID_KEY, userId.toString());
}

export function clearAuthSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ROLE_KEY);
  sessionStorage.removeItem(USER_ID_KEY);
}

export function getAuthToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getAuthRole(): UserRole | null {
  const value = sessionStorage.getItem(ROLE_KEY);
  if (value === "STUDENT" || value === "EDUCATOR") {
    return value;
  }
  return null;
}

export function getAuthUserId(): number | null {
  const value = sessionStorage.getItem(USER_ID_KEY);
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

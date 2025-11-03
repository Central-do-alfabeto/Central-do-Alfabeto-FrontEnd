const AUTH_SESSION_KEY = "auth.session.v1";
const DEFAULT_SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 dias

export type UserRole = "STUDENT" | "EDUCATOR";

type PlayerMetadata = {
  currentPhaseIndex?: number;
  email?: string;
};

export type AuthSession = {
  token: string;
  role: UserRole;
  userId: number;
  playerMeta?: PlayerMetadata;
};

type PersistedAuthSession = AuthSession & {
  createdAt: number;
  expiresAt: number;
  version: number;
};

function parseStoredSession(): PersistedAuthSession | null {
  const raw = localStorage.getItem(AUTH_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as PersistedAuthSession;

    if (typeof parsed !== "object" || parsed === null) {
      throw new Error("Parsed session is not an object");
    }

    if (typeof parsed.expiresAt !== "number" || Date.now() > parsed.expiresAt) {
      clearAuthSession();
      return null;
    }

    return parsed;
  } catch (error) {
    console.warn("Falha ao ler sessão armazenada. Limpando cache.", error);
    clearAuthSession();
    return null;
  }
}

function writePersistedSession(session: PersistedAuthSession) {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

function persistSession(session: AuthSession, ttlMs?: number) {
  const now = Date.now();
  const payload: PersistedAuthSession = {
    ...session,
    createdAt: now,
    expiresAt: now + (ttlMs ?? DEFAULT_SESSION_TTL_MS),
    version: 1,
  };

  writePersistedSession(payload);
}

export function setAuthSession(session: AuthSession, ttlMs?: number) {
  persistSession(session, ttlMs);
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

export function getAuthSession(): AuthSession | null {
  const stored = parseStoredSession();
  if (!stored) {
    return null;
  }

  const { token, role, userId, playerMeta } = stored;
  return { token, role, userId, playerMeta };
}

export function getAuthToken(): string | null {
  const stored = parseStoredSession();
  return stored?.token ?? null;
}

export function getAuthRole(): UserRole | null {
  const stored = parseStoredSession();
  return stored?.role ?? null;
}

export function getAuthUserId(): number | null {
  const stored = parseStoredSession();
  return stored?.userId ?? null;
}

export function updatePlayerMetadata(partial: PlayerMetadata) {
  const stored = parseStoredSession();
  if (!stored) {
    return;
  }

  const updated: PersistedAuthSession = {
    ...stored,
    playerMeta: {
      ...stored.playerMeta,
      ...partial,
    },
  };

  writePersistedSession(updated);
}

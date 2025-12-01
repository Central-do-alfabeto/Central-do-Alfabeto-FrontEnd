const AUTH_SESSION_KEY = "auth.session.v1";

export type UserRole = "STUDENT" | "EDUCATOR";

type PlayerMetadata = {
  currentPhaseIndex?: number;
  email?: string;
};

export type AuthSession = {
  token: string;
  role: UserRole;
  userId: string;
  playerMeta?: PlayerMetadata;
};

type PersistedAuthSession = AuthSession & {
  createdAt: number;
  expiresAt: number | null;
  version: number;
  persistent: boolean;
};

type PersistOptions = {
  persistent?: boolean;
  ttlMs?: number;
};

function readStoredSession(storage: Storage): PersistedAuthSession | null {
  const raw = storage.getItem(AUTH_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as PersistedAuthSession & Partial<{ persistent: boolean }>;

    if (typeof parsed !== "object" || parsed === null) {
      throw new Error("Parsed session is not an object");
    }

    const expiresAtValue = parsed.expiresAt ?? null;
    if (expiresAtValue !== null && typeof expiresAtValue === "number" && Date.now() > expiresAtValue) {
      storage.removeItem(AUTH_SESSION_KEY);
      return null;
    }

    const persistent = typeof parsed.persistent === "boolean" ? parsed.persistent : storage === localStorage;

    return {
      ...parsed,
      expiresAt: expiresAtValue,
      persistent,
    };
  } catch (error) {
    console.warn("Falha ao ler sessão armazenada. Limpando cache.", error);
    storage.removeItem(AUTH_SESSION_KEY);
    return null;
  }
}

function parseStoredSession(): PersistedAuthSession | null {
  const sessionScoped = readStoredSession(sessionStorage);
  if (sessionScoped) {
    return sessionScoped;
  }

  return readStoredSession(localStorage);
}

function saveSession(payload: PersistedAuthSession) {
  const targetStorage = payload.persistent ? localStorage : sessionStorage;
  const otherStorage = payload.persistent ? sessionStorage : localStorage;

  targetStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(payload));
  otherStorage.removeItem(AUTH_SESSION_KEY);
}

function persistSession(session: AuthSession, options?: PersistOptions) {
  const now = Date.now();
  const persistent = options?.persistent ?? false;
  const expiresAt = persistent
    ? (typeof options?.ttlMs === "number" ? now + options.ttlMs : null)
    : null;

  const payload: PersistedAuthSession = {
    ...session,
    createdAt: now,
    expiresAt,
    version: 2,
    persistent,
  };

  saveSession(payload);
}

export function setAuthSession(session: AuthSession, options?: PersistOptions) {
  persistSession(session, options);
}

export function clearAuthSession() {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
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

export function getAuthUserId(): string | null {
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

  saveSession(updated);
}

// gameState.ts
import { getAuthSession, updatePlayerMetadata } from "./auth";

const persistedSession = getAuthSession();

function setSessionNumber(key: string, value: number) {
  sessionStorage.setItem(key, value.toString());
}

function getSessionNumber(
  key: string,
  defaultValue: number = 0,
  fallback?: () => number | null | undefined
): number {
  const stored = sessionStorage.getItem(key);
  if (stored !== null) {
    const parsed = Number(stored);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  if (fallback) {
    const candidate = fallback();
    if (typeof candidate === "number" && !Number.isNaN(candidate)) {
      setSessionNumber(key, candidate);
      return candidate;
    }
  }

  return defaultValue;
}

function getSessionString(key: string): string | null {
  return sessionStorage.getItem(key);
}

function setSessionString(key: string, value: string | null) {
  if (value === null) {
    sessionStorage.removeItem(key);
    return;
  }

  sessionStorage.setItem(key, value);
}

export function clearPlayerSessionState() {
  currentPhaseIndex = 0;
  sessionStorage.removeItem("currentPhaseIndex");

  PlayerID = null;
  sessionStorage.removeItem("PlayerID");

  TotalErrors = 0;
  sessionStorage.removeItem("TotalErrors");

  TotalAudioReproductions = 0;
  sessionStorage.removeItem("TotalAudioReproductions");

  inGameFlow = false;
  sessionStorage.removeItem("inGameFlow");
}

// currentPhaseIndex
export let currentPhaseIndex: number = getSessionNumber(
  "currentPhaseIndex",
  0,
  () => persistedSession?.playerMeta?.currentPhaseIndex
);
export function setCurrentPhaseIndex(value: number) {
  currentPhaseIndex += value;
  setSessionNumber("currentPhaseIndex", currentPhaseIndex);
  updatePlayerMetadata({ currentPhaseIndex });
}

export function syncCurrentPhaseIndex(value: number) {
  currentPhaseIndex = value;
  setSessionNumber("currentPhaseIndex", currentPhaseIndex);
  updatePlayerMetadata({ currentPhaseIndex });
}

// PlayerID
export let PlayerID: string | null = getSessionString("PlayerID") ??
  (persistedSession?.role === "STUDENT" ? persistedSession.userId : null);
if (PlayerID !== null) {
  setSessionString("PlayerID", PlayerID);
}
export function setPlayerID(value: string | null) {
  PlayerID = value;
  setSessionString("PlayerID", PlayerID);
}

// TotalErrors
export let TotalErrors: number = getSessionNumber("TotalErrors", 0);
export function incrementTotalErrors() {
  TotalErrors += 1;
  setSessionNumber("TotalErrors", TotalErrors);
}

// TotalAudioReproductions
export let TotalAudioReproductions: number = getSessionNumber("TotalAudioReproductions", 0);
export function incrementTotalAudioReproductions() {
  TotalAudioReproductions += 1;
  setSessionNumber("TotalAudioReproductions", TotalAudioReproductions);
}

export function resetTotalValues() {
  TotalAudioReproductions = 0;
  TotalErrors = 0;
  setSessionNumber("TotalErrors", TotalErrors);
  setSessionNumber("TotalAudioReproductions", TotalAudioReproductions);
}

// inGameFlow
export let inGameFlow: boolean = getSessionBoolean("inGameFlow", false);
export function setInGameFlow(value: boolean) {
  inGameFlow = value;
  sessionStorage.setItem("inGameFlow", value.toString());
}

function getSessionBoolean(key: string, defaultValue: boolean): boolean {
  const stored = sessionStorage.getItem(key);
  return stored !== null ? stored === "true" : defaultValue;
}

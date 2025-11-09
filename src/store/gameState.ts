// gameState.ts
import { updatePlayerMetadata } from "./auth";

// Função auxiliar para ler do sessionStorage ou usar valor padrão
function getSessionNumber(key: string, defaultValue: number = 0): number {
  const stored = sessionStorage.getItem(key);
  return stored !== null ? Number(stored) : defaultValue;
}

// Função auxiliar para salvar no sessionStorage
function setSessionNumber(key: string, value: number) {
  sessionStorage.setItem(key, value.toString());
}

// currentPhaseIndex
export let currentPhaseIndex: number = getSessionNumber("currentPhaseIndex", 0);
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
export let PlayerID: number = getSessionNumber("PlayerID", 0);
export function setPlayerID(value: number) {
  PlayerID = value;
  setSessionNumber("PlayerID", PlayerID);
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

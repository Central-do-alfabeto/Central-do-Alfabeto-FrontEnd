import type { PlayerProgressPayload } from "./types";

export type LocalPhaseSnapshot = {
  phaseIndex: number;
  totalErrors: number;
  totalAudioReproductions: number;
};

export type LocalProgress = {
  currentPhaseIndex: number;
  snapshots: LocalPhaseSnapshot[];
};

export const LOCAL_PROGRESS_KEY = "centralDoAlfabeto.demo.progress.v1";

const EMPTY: LocalProgress = { currentPhaseIndex: 0, snapshots: [] };

function isCount(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

/** Lê o progresso do aparelho. Qualquer dado ausente ou inválido volta ao início. */
export function readLocalProgress(): LocalProgress {
  try {
    const raw = localStorage.getItem(LOCAL_PROGRESS_KEY);
    if (!raw) return { ...EMPTY, snapshots: [] };

    const parsed = JSON.parse(raw) as Partial<LocalProgress>;
    const snapshots = Array.isArray(parsed.snapshots)
      ? parsed.snapshots.filter(
          (item): item is LocalPhaseSnapshot =>
            !!item && isCount(item.phaseIndex) && isCount(item.totalErrors) && isCount(item.totalAudioReproductions)
        )
      : [];

    return {
      currentPhaseIndex: isCount(parsed.currentPhaseIndex) ? parsed.currentPhaseIndex : 0,
      snapshots,
    };
  } catch {
    return { ...EMPTY, snapshots: [] };
  }
}

function writeLocalProgress(progress: LocalProgress) {
  try {
    localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn("Não foi possível salvar o progresso neste aparelho.", error);
  }
}

/** Registra a fase concluída e libera a próxima. */
export function saveLocalPhase(payload: PlayerProgressPayload): LocalProgress {
  const current = readLocalProgress();
  const snapshots = current.snapshots.filter((item) => item.phaseIndex !== payload.currentPhaseIndex);
  snapshots.push({
    phaseIndex: payload.currentPhaseIndex,
    totalErrors: payload.errorsData,
    totalAudioReproductions: payload.soundRepeatsData,
  });
  snapshots.sort((a, b) => a.phaseIndex - b.phaseIndex);

  const next: LocalProgress = {
    currentPhaseIndex: Math.max(current.currentPhaseIndex, payload.currentPhaseIndex + 1),
    snapshots,
  };
  writeLocalProgress(next);
  return next;
}

export function resetLocalProgress() {
  try {
    localStorage.removeItem(LOCAL_PROGRESS_KEY);
  } catch {
    /* sem armazenamento disponível: nada a apagar */
  }
}

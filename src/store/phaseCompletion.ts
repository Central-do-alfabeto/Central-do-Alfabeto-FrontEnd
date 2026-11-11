/**
 * Registro da fase que acabou de ser concluída, guardado na sessão do navegador.
 *
 * A tela de parabéns usa este registro (e não o índice global da fase atual, que já é
 * incrementado depois de salvar) para saber qual fase salvar. Assim, recarregar a tela
 * não salva nem avança de novo, e abrir a URL sem ter concluído uma fase não dá progresso.
 */
const KEY = "phaseCompletion.v1";

export type PhaseCompletion = {
  phase: number;
  errors: number;
  audioReproductions: number;
  saved: boolean;
};

function isCount(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export function readPhaseCompletion(): PhaseCompletion | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PhaseCompletion>;
    if (!isCount(parsed.phase) || !isCount(parsed.errors) || !isCount(parsed.audioReproductions)) {
      return null;
    }
    return {
      phase: parsed.phase,
      errors: parsed.errors,
      audioReproductions: parsed.audioReproductions,
      saved: parsed.saved === true,
    };
  } catch {
    return null;
  }
}

function write(value: PhaseCompletion) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    /* sem armazenamento disponível */
  }
}

/** Chamado ao terminar a última atividade da fase. Não sobrescreve o registro da mesma fase. */
export function markPhaseCompletion(phase: number, errors: number, audioReproductions: number) {
  const current = readPhaseCompletion();
  if (current && current.phase === phase) return;
  write({ phase, errors, audioReproductions, saved: false });
}

export function markPhaseCompletionSaved() {
  const current = readPhaseCompletion();
  if (current) write({ ...current, saved: true });
}

export function clearPhaseCompletion() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* nada a limpar */
  }
}

import { isDemoMode } from "../../config/env";
import { playerDataUpdate } from "../api/playerDataUpdate";
import { saveLocalPhase } from "./localProgress";
import type { ProgressService } from "./types";

export type { PlayerProgressPayload, ProgressService } from "./types";

/** Modo demonstração: guarda no localStorage, sem nenhuma chamada HTTP. */
export const localProgressService: ProgressService = {
  async saveCompletedPhase(payload) {
    saveLocalPhase(payload);
  },
};

/** Com backend: envia o progresso para a API. */
export const httpProgressService: ProgressService = {
  async saveCompletedPhase(payload) {
    await playerDataUpdate(payload);
  },
};

export function getProgressService(): ProgressService {
  return isDemoMode() ? localProgressService : httpProgressService;
}

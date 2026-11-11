export type PlayerProgressPayload = {
  currentPhaseIndex: number;
  errorsData: number;
  soundRepeatsData: number;
};

/** Contrato usado pelas telas para registrar o progresso, com implementação local ou HTTP. */
export interface ProgressService {
  saveCompletedPhase(payload: PlayerProgressPayload): Promise<void>;
}

/**
 * Motores de reconhecimento de fala:
 * - "web-speech": Web Speech API do navegador (padrão);
 * - "server": endpoint Vosk do backend (só com VITE_API_URL);
 * - "assisted": sem reconhecimento; um adulto confirma se a criança falou certo.
 */
export type SpeechEngine = "web-speech" | "server" | "assisted";

export type SpeechErrorCode =
  | "permission-denied"
  | "no-microphone"
  | "no-speech"
  | "network"
  | "failed";

export type SpeechHandlers = {
  /** Transcrições candidatas (a primeira é a mais provável). */
  onResult(alternatives: string[]): void;
  onError(code: SpeechErrorCode, detail?: string): void;
  /** A captura terminou e a fala está sendo interpretada (usado pelo motor de servidor). */
  onProcessing?(): void;
  /** Sempre chamado ao final, depois de resultado ou erro. */
  onEnd(): void;
};

export interface SpeechRecognizer {
  readonly engine: Exclude<SpeechEngine, "assisted">;
  start(handlers: SpeechHandlers): Promise<void>;
  /** Encerra a captura e entrega o resultado. */
  stop(): void;
  /** Cancela sem entregar nada. */
  abort(): void;
}

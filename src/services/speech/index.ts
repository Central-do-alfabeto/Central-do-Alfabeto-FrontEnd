import { getApiUrl, getPreferredSpeechEngine } from "../../config/env";
import { ServerSpeechRecognizer } from "./serverRecognizer";
import type { SpeechEngine, SpeechRecognizer } from "./types";
import { WebSpeechRecognizer, isWebSpeechSupported } from "./webSpeechRecognizer";

export type { SpeechEngine, SpeechErrorCode, SpeechHandlers, SpeechRecognizer } from "./types";

type EngineOptions = {
  webSpeechSupported: boolean;
  apiUrl: string;
  preferred?: string;
};

/**
 * Escolha do motor:
 * 1. servidor, se houver backend e o ambiente pedir (VITE_SPEECH_ENGINE=server);
 * 2. Web Speech API, se o navegador suportar (padrão);
 * 3. servidor, se houver backend e o navegador não suportar Web Speech;
 * 4. modo assistido (um adulto confirma).
 */
export function selectSpeechEngine({ webSpeechSupported, apiUrl, preferred }: EngineOptions): SpeechEngine {
  const serverAvailable = apiUrl !== "";

  if (serverAvailable && preferred === "server") return "server";
  if (webSpeechSupported) return "web-speech";
  if (serverAvailable) return "server";
  return "assisted";
}

export function detectSpeechEngine(): SpeechEngine {
  return selectSpeechEngine({
    webSpeechSupported: isWebSpeechSupported(),
    apiUrl: getApiUrl(),
    preferred: getPreferredSpeechEngine(),
  });
}

export function createSpeechRecognizer(engine: SpeechEngine): SpeechRecognizer | null {
  switch (engine) {
    case "web-speech":
      return new WebSpeechRecognizer();
    case "server":
      return new ServerSpeechRecognizer();
    default:
      return null;
  }
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL do backend. Quando ausente, o app roda em modo demonstração (sem contas e sem chamadas HTTP). */
  readonly VITE_API_URL?: string;
  /** "server" prefere o Vosk do backend (se VITE_API_URL existir); outro valor prefere a Web Speech API. */
  readonly VITE_SPEECH_ENGINE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

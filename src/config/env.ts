/** URL do backend configurada no build (vazia quando não há backend). */
export function getApiUrl(): string {
  return (import.meta.env.VITE_API_URL ?? "").trim();
}

/** Sem backend configurado o app roda em modo demonstração: sem contas e com progresso local. */
export function isDemoMode(): boolean {
  return getApiUrl() === "";
}

/** Motor de fala preferido pelo ambiente ("server" usa o Vosk do backend, quando existir). */
export function getPreferredSpeechEngine(): string {
  return (import.meta.env.VITE_SPEECH_ENGINE ?? "").trim().toLowerCase();
}

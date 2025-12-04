type DebugApi = {
  enableAutoSpeechAutoPass(): boolean;
  disableAutoSpeechAutoPass(): boolean;
  toggleAutoSpeechAutoPass(force?: boolean): boolean;
  isAutoSpeechAutoPassEnabled(): boolean;
};

const state = {
  autoSpeechAutoPass: false,
};

function setAutoSpeechAutoPassEnabled(flag: boolean): boolean {
  state.autoSpeechAutoPass = flag;
  return state.autoSpeechAutoPass;
}

export function isAutoSpeechAutoPassEnabled(): boolean {
  return state.autoSpeechAutoPass;
}

function enableAutoSpeechAutoPass(): boolean {
  return setAutoSpeechAutoPassEnabled(true);
}

function disableAutoSpeechAutoPass(): boolean {
  return setAutoSpeechAutoPassEnabled(false);
}

function toggleAutoSpeechAutoPass(force?: boolean): boolean {
  if (typeof force === "boolean") {
    return setAutoSpeechAutoPassEnabled(force);
  }

  return setAutoSpeechAutoPassEnabled(!state.autoSpeechAutoPass);
}

const api: DebugApi = {
  enableAutoSpeechAutoPass,
  disableAutoSpeechAutoPass,
  toggleAutoSpeechAutoPass,
  isAutoSpeechAutoPassEnabled,
};

if (typeof window !== "undefined") {
  const globalWindow = window as typeof window & { centralDoAlfabetoDebug?: DebugApi };

  if (globalWindow.centralDoAlfabetoDebug) {
    Object.assign(globalWindow.centralDoAlfabetoDebug, api);
  } else {
    Object.defineProperty(globalWindow, "centralDoAlfabetoDebug", {
      value: api,
      configurable: false,
      enumerable: false,
      writable: false,
    });
  }
}

export default api;

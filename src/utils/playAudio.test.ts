import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getSpokenText, playAudio, stopAudio } from "./playAudio";

type Behavior = "play" | "missing" | "blocked";

const requested: string[] = [];
let behavior: (path: string) => Behavior;

class FakeAudio {
  static instances: FakeAudio[] = [];
  private listeners: Record<string, Array<() => void>> = {};
  src: string;
  constructor(src: string) {
    this.src = src;
    requested.push(src);
  }
  addEventListener(type: string, fn: () => void) {
    (this.listeners[type] ??= []).push(fn);
  }
  paused = false;
  pause() {
    this.paused = true;
  }
  emit(type: string) {
    this.listeners[type]?.forEach((fn) => fn());
  }
  play(): Promise<void> {
    FakeAudio.instances.push(this);
    const result = behavior(this.src);
    if (result === "play") return Promise.resolve();
    if (result === "blocked") return Promise.reject(new DOMException("blocked", "NotAllowedError"));
    this.listeners.error?.forEach((fn) => fn());
    return Promise.reject(new DOMException("not supported", "NotSupportedError"));
  }
}

const speak = vi.fn();
const cancel = vi.fn();

class FakeUtterance {
  lang = "";
  voice: unknown = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  text: string;
  constructor(text: string) {
    this.text = text;
  }
}

beforeEach(() => {
  requested.length = 0;
  FakeAudio.instances = [];
  vi.stubGlobal("Audio", FakeAudio);
  vi.stubGlobal("SpeechSynthesisUtterance", FakeUtterance);
  Object.defineProperty(window, "speechSynthesis", {
    configurable: true,
    value: { speak, cancel, getVoices: () => [{ lang: "en-US" }, { lang: "pt_BR", name: "pt" }] },
  });
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  stopAudio();
  vi.unstubAllGlobals();
  Reflect.deleteProperty(window, "speechSynthesis");
});

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("playAudio", () => {
  it("toca o arquivo quando ele existe, sem usar a síntese de voz", async () => {
    behavior = () => "play";
    const setRunning = vi.fn();

    playAudio("resposta_correta", setRunning);
    await flush();

    expect(requested).toHaveLength(1);
    expect(requested[0]).toContain("audio/resposta_correta.mp3");
    expect(setRunning).toHaveBeenLastCalledWith(true);
    expect(speak).not.toHaveBeenCalled();
  });

  it("tenta o nome em minúsculas antes de recorrer à síntese de voz", async () => {
    behavior = (path) => (path.endsWith("silaba_ba.mp3") ? "play" : "missing");

    playAudio("silaba_Ba", vi.fn());
    await flush();

    expect(requested.map((p) => p.split("/").pop())).toEqual(["silaba_Ba.mp3", "silaba_ba.mp3"]);
    expect(speak).not.toHaveBeenCalled();
  });

  it("usa a síntese de voz em pt-BR quando o arquivo não existe", async () => {
    behavior = () => "missing";
    const setRunning = vi.fn();

    playAudio("palavra_Kiwi", setRunning);
    await flush();

    expect(speak).toHaveBeenCalledTimes(1);
    const utterance = speak.mock.calls[0][0] as FakeUtterance;
    expect(utterance.text).toBe("Kiwi");
    expect(utterance.lang).toBe("pt-BR");
    expect(utterance.voice).toEqual({ lang: "pt_BR", name: "pt" });
    expect(setRunning).toHaveBeenLastCalledWith(true);

    utterance.onend?.();
    expect(setRunning).toHaveBeenLastCalledWith(false);
  });

  it("não usa a síntese de voz quando o navegador bloqueia o autoplay", async () => {
    behavior = () => "blocked";
    const setRunning = vi.fn();

    playAudio("tela_inicial", setRunning);
    await flush();

    expect(speak).not.toHaveBeenCalled();
    expect(setRunning).toHaveBeenLastCalledWith(false);
  });

  it("libera os botões quando nem a síntese de voz está disponível", async () => {
    behavior = () => "missing";
    Reflect.deleteProperty(window, "speechSynthesis");
    const setRunning = vi.fn();

    playAudio("palavra_Yoga", setRunning);
    await flush();

    expect(setRunning).toHaveBeenLastCalledWith(false);
  });
});

describe("uma única reprodução ativa", () => {
  it("iniciar outro áudio para o anterior e ignora o fim do antigo", async () => {
    behavior = () => "play";
    const first = vi.fn();
    const second = vi.fn();

    playAudio("essa_letra_A_alfabeto", first);
    await flush();
    playAudio("essa_letra_B_alfabeto", second);
    await flush();

    const [oldAudio, newAudio] = FakeAudio.instances;
    expect(oldAudio.paused).toBe(true);
    expect(newAudio.paused).toBe(false);

    first.mockClear();
    second.mockClear();
    oldAudio.emit("ended");
    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();

    newAudio.emit("ended");
    expect(second).toHaveBeenLastCalledWith(false);
  });

  it("stopAudio da tela dona para o áudio; de outra tela não mexe", async () => {
    behavior = () => "play";
    const mine = vi.fn();
    const other = vi.fn();

    playAudio("tela_inicial", mine);
    await flush();

    stopAudio(other);
    expect(FakeAudio.instances[0].paused).toBe(false);

    stopAudio(mine);
    expect(FakeAudio.instances[0].paused).toBe(true);
    expect(mine).toHaveBeenLastCalledWith(false);
  });

  it("parar cancela também a voz sintetizada e ignora o fim dela", async () => {
    behavior = () => "missing";
    const setRunning = vi.fn();

    playAudio("palavra_Kiwi", setRunning);
    await flush();
    expect(speak).toHaveBeenCalledTimes(1);
    const utterance = speak.mock.calls[0][0] as FakeUtterance;

    cancel.mockClear();
    stopAudio(setRunning);
    expect(cancel).toHaveBeenCalled();

    setRunning.mockClear();
    utterance.onend?.();
    expect(setRunning).not.toHaveBeenCalled();
  });

  it("áudio parado enquanto carregava não cai na voz sintetizada", async () => {
    behavior = () => "missing";
    const setRunning = vi.fn();

    playAudio("palavra_Yoga", setRunning);
    stopAudio(setRunning);
    await flush();

    expect(speak).not.toHaveBeenCalled();
  });
});

describe("getSpokenText", () => {
  it("monta o texto falado a partir do nome do áudio", () => {
    expect(getSpokenText("palavra_Wafer")).toBe("Wafer");
    expect(getSpokenText("silaba_Ka")).toBe("ka");
    expect(getSpokenText("essa_letra_Y_alfabeto")).toBe("Esta é a letra Y.");
    expect(getSpokenText("Parabens_aprendeu_K")).toBe("Parabéns! Você aprendeu a letra K!");
    expect(getSpokenText("selecione_letra_W")).toBe("Selecione a letra W.");
    expect(getSpokenText("resposta_errada")).toBe("Tente de novo.");
    expect(getSpokenText("algum_audio_novo")).toBe("algum audio novo");
  });
});

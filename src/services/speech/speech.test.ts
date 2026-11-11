import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { selectSpeechEngine } from "./index";
import { WebSpeechRecognizer, isWebSpeechSupported } from "./webSpeechRecognizer";
import type { SpeechHandlers } from "./types";
import { FakeSpeechRecognition } from "../../test/fakeSpeechRecognition";

function makeHandlers() {
  const handlers = {
    onResult: vi.fn(),
    onError: vi.fn(),
    onEnd: vi.fn(),
  } satisfies SpeechHandlers;
  return handlers;
}

describe("selectSpeechEngine", () => {
  it("usa Web Speech por padrão quando o navegador suporta", () => {
    expect(selectSpeechEngine({ webSpeechSupported: true, apiUrl: "" })).toBe("web-speech");
    expect(selectSpeechEngine({ webSpeechSupported: true, apiUrl: "http://api" })).toBe("web-speech");
  });

  it("usa o servidor só com backend configurado e preferência explícita", () => {
    expect(selectSpeechEngine({ webSpeechSupported: true, apiUrl: "http://api", preferred: "server" })).toBe("server");
    expect(selectSpeechEngine({ webSpeechSupported: true, apiUrl: "", preferred: "server" })).toBe("web-speech");
  });

  it("usa o servidor quando o navegador não tem Web Speech mas há backend", () => {
    expect(selectSpeechEngine({ webSpeechSupported: false, apiUrl: "http://api" })).toBe("server");
  });

  it("cai no modo assistido sem Web Speech e sem backend", () => {
    expect(selectSpeechEngine({ webSpeechSupported: false, apiUrl: "" })).toBe("assisted");
  });
});

describe("WebSpeechRecognizer", () => {
  beforeEach(() => {
    FakeSpeechRecognition.instances = [];
    vi.stubGlobal("SpeechRecognition", FakeSpeechRecognition);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    Reflect.deleteProperty(window, "SpeechRecognition");
    Reflect.deleteProperty(window, "webkitSpeechRecognition");
  });

  it("detecta suporte, inclusive pelo prefixo webkit", () => {
    expect(isWebSpeechSupported()).toBe(true);
    vi.unstubAllGlobals();
    Reflect.deleteProperty(window, "SpeechRecognition");
    expect(isWebSpeechSupported()).toBe(false);
    vi.stubGlobal("webkitSpeechRecognition", FakeSpeechRecognition);
    expect(isWebSpeechSupported()).toBe(true);
  });

  it("configura pt-BR e entrega as alternativas reconhecidas", async () => {
    const handlers = makeHandlers();
    await new WebSpeechRecognizer().start(handlers);

    const fake = FakeSpeechRecognition.instances[0];
    expect(fake.started).toBe(true);
    expect(fake.lang).toBe("pt-BR");
    expect(fake.continuous).toBe(false);
    expect(fake.maxAlternatives).toBeGreaterThan(1);

    fake.emitResult("bê", "be");
    fake.onend?.();

    expect(handlers.onResult).toHaveBeenCalledWith(["bê", "be"]);
    expect(handlers.onError).not.toHaveBeenCalled();
    expect(handlers.onEnd).toHaveBeenCalledTimes(1);
  });

  it("traduz erros do navegador", async () => {
    const cases: Array<[string, string]> = [
      ["not-allowed", "permission-denied"],
      ["service-not-allowed", "permission-denied"],
      ["audio-capture", "no-microphone"],
      ["no-speech", "no-speech"],
      ["network", "network"],
      ["language-not-supported", "failed"],
    ];

    for (const [browserError, code] of cases) {
      const handlers = makeHandlers();
      await new WebSpeechRecognizer().start(handlers);
      const fake = FakeSpeechRecognition.instances.at(-1)!;
      fake.onerror?.({ error: browserError });
      fake.onend?.();
      expect(handlers.onError, browserError).toHaveBeenCalledWith(code);
      expect(handlers.onEnd).toHaveBeenCalledTimes(1);
    }
  });

  it("avisa quando termina sem ouvir nada", async () => {
    const handlers = makeHandlers();
    await new WebSpeechRecognizer().start(handlers);
    FakeSpeechRecognition.instances[0].onend?.();

    expect(handlers.onError).toHaveBeenCalledWith("no-speech");
    expect(handlers.onResult).not.toHaveBeenCalled();
  });

  it("abort cancela sem chamar os callbacks", async () => {
    const handlers = makeHandlers();
    const recognizer = new WebSpeechRecognizer();
    await recognizer.start(handlers);
    recognizer.abort();

    const fake = FakeSpeechRecognition.instances[0];
    expect(fake.aborted).toBe(true);
    expect(fake.onend).toBeNull();
    expect(handlers.onEnd).not.toHaveBeenCalled();
  });
});

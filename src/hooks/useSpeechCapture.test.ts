import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import useSpeechCapture from "./useSpeechCapture";
import { FakeSpeechRecognition } from "../test/fakeSpeechRecognition";

describe("useSpeechCapture", () => {
  beforeEach(() => {
    FakeSpeechRecognition.instances = [];
    vi.stubEnv("VITE_API_URL", "");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("usa Web Speech, mostra 'ouvindo' e entrega o resultado", async () => {
    vi.stubGlobal("SpeechRecognition", FakeSpeechRecognition);
    const onAlternatives = vi.fn();
    const { result } = renderHook(() => useSpeechCapture(onAlternatives));

    expect(result.current.engine).toBe("web-speech");
    expect(result.current.status).toBe("idle");

    await act(async () => result.current.toggle());
    expect(result.current.isListening).toBe(true);

    await act(async () => {
      FakeSpeechRecognition.instances[0].emitResult("casa");
      FakeSpeechRecognition.instances[0].onend?.();
    });

    expect(onAlternatives).toHaveBeenCalledWith(["casa"]);
    expect(result.current.status).toBe("idle");
    expect(result.current.error).toBeNull();
  });

  it("vai para o modo assistido quando o microfone é negado", async () => {
    vi.stubGlobal("SpeechRecognition", FakeSpeechRecognition);
    const { result } = renderHook(() => useSpeechCapture(vi.fn()));

    await act(async () => result.current.toggle());
    await act(async () => {
      FakeSpeechRecognition.instances[0].onerror?.({ error: "not-allowed" });
      FakeSpeechRecognition.instances[0].onend?.();
    });

    expect(result.current.engine).toBe("assisted");
    expect(result.current.micBlocked).toBe(true);
    expect(result.current.error).toMatch(/microfone/i);

    act(() => result.current.retryMicrophone());
    expect(result.current.engine).toBe("web-speech");
    expect(result.current.error).toBeNull();
  });

  it("fica no modo assistido sem Web Speech e sem backend", () => {
    const { result } = renderHook(() => useSpeechCapture(vi.fn()));
    expect(result.current.engine).toBe("assisted");
  });

  it("mostra mensagem quando nada foi ouvido, sem sair do reconhecimento", async () => {
    vi.stubGlobal("SpeechRecognition", FakeSpeechRecognition);
    const { result } = renderHook(() => useSpeechCapture(vi.fn()));

    await act(async () => result.current.toggle());
    await act(async () => FakeSpeechRecognition.instances[0].onend?.());

    expect(result.current.engine).toBe("web-speech");
    expect(result.current.error).toMatch(/não ouvi/i);
  });
});

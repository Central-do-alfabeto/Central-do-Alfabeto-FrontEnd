import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/sendRecording", () => ({ default: vi.fn() }));
vi.mock("../../utils/audioUtils", () => ({ convertWebMToWAV: vi.fn() }));

import { ServerSpeechRecognizer } from "./serverRecognizer";

function makeHandlers() {
  return { onResult: vi.fn(), onError: vi.fn(), onEnd: vi.fn(), onProcessing: vi.fn() };
}

function makeStream() {
  const track = { stop: vi.fn() };
  return { stream: { getTracks: () => [track] } as unknown as MediaStream, track };
}

describe("ServerSpeechRecognizer", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("abort() durante o pedido de permissão encerra o stream que chega depois", async () => {
    const { stream, track } = makeStream();
    let release!: (value: MediaStream) => void;
    const getUserMedia = vi.fn(() => new Promise<MediaStream>((resolve) => (release = resolve)));
    vi.stubGlobal("navigator", { mediaDevices: { getUserMedia } });
    const recorderCtor = vi.fn();
    vi.stubGlobal("MediaRecorder", recorderCtor);

    const handlers = makeHandlers();
    const recognizer = new ServerSpeechRecognizer();
    const started = recognizer.start(handlers);

    recognizer.abort();
    release(stream);
    await started;

    expect(track.stop).toHaveBeenCalledTimes(1);
    expect(recorderCtor).not.toHaveBeenCalled();
    expect(handlers.onResult).not.toHaveBeenCalled();
    expect(handlers.onError).not.toHaveBeenCalled();
  });

  it("abort() durante o pedido não reclama de permissão negada depois", async () => {
    let fail!: (error: unknown) => void;
    const getUserMedia = vi.fn(() => new Promise<MediaStream>((_, reject) => (fail = reject)));
    vi.stubGlobal("navigator", { mediaDevices: { getUserMedia } });

    const handlers = makeHandlers();
    const recognizer = new ServerSpeechRecognizer();
    const started = recognizer.start(handlers);

    recognizer.abort();
    fail(new DOMException("negado", "NotAllowedError"));
    await started;

    expect(handlers.onError).not.toHaveBeenCalled();
    expect(handlers.onEnd).not.toHaveBeenCalled();
  });

  it("sem abort, grava normalmente e libera o microfone ao parar", async () => {
    const { stream, track } = makeStream();
    vi.stubGlobal("navigator", { mediaDevices: { getUserMedia: vi.fn(async () => stream) } });

    const recorder = {
      state: "recording",
      ondataavailable: null as null | ((e: { data: Blob }) => void),
      onstop: null as null | (() => Promise<void>),
      start: vi.fn(),
      stop: vi.fn(function (this: { state: string; onstop: null | (() => Promise<void>) }) {
        this.state = "inactive";
        void this.onstop?.();
      }),
    };
    vi.stubGlobal("MediaRecorder", vi.fn(function () { return recorder; }));

    const recognizer = new ServerSpeechRecognizer();
    await recognizer.start(makeHandlers());
    expect(recorder.start).toHaveBeenCalled();

    recognizer.stop();
    expect(track.stop).toHaveBeenCalled();
  });
});

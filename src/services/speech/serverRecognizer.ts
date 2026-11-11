import sendRecording from "../api/sendRecording";
import { convertWebMToWAV } from "../../utils/audioUtils";
import type { SpeechHandlers, SpeechRecognizer } from "./types";

/**
 * Captura o áudio do microfone, converte para WAV e envia ao endpoint Vosk do backend.
 * Só é usado quando VITE_API_URL está definida.
 */
export class ServerSpeechRecognizer implements SpeechRecognizer {
  readonly engine = "server" as const;
  private stream: MediaStream | null = null;
  private recorder: MediaRecorder | null = null;
  private aborted = false;

  private releaseStream() {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
  }

  async start(handlers: SpeechHandlers): Promise<void> {
    this.aborted = false;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        handlers.onError("permission-denied");
      } else if (name === "NotFoundError") {
        handlers.onError("no-microphone");
      } else {
        handlers.onError("failed");
      }
      handlers.onEnd();
      return;
    }

    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(this.stream);
    this.recorder = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };

    recorder.onstop = async () => {
      this.releaseStream();
      this.recorder = null;
      if (this.aborted) return;

      handlers.onProcessing?.();
      try {
        const wav = await convertWebMToWAV(new Blob(chunks, { type: "audio/webm;codecs=opus" }));
        const transcript = await sendRecording(wav);
        if (!this.aborted) handlers.onResult([transcript]);
      } catch (error) {
        if (!this.aborted) {
          handlers.onError("network", error instanceof Error ? error.message : undefined);
        }
      } finally {
        if (!this.aborted) handlers.onEnd();
      }
    };

    recorder.start();
  }

  stop(): void {
    if (this.recorder && this.recorder.state !== "inactive") {
      this.recorder.stop();
    }
  }

  abort(): void {
    this.aborted = true;
    if (this.recorder && this.recorder.state !== "inactive") {
      this.recorder.stop();
    }
    this.releaseStream();
    this.recorder = null;
  }
}

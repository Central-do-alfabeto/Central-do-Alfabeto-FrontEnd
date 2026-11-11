import type { SpeechErrorCode, SpeechHandlers, SpeechRecognizer } from "./types";

type RecognitionAlternative = { transcript: string };
type RecognitionResult = ArrayLike<RecognitionAlternative>;
type RecognitionEvent = { results: ArrayLike<RecognitionResult> };
type RecognitionErrorEvent = { error: string };

interface RecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type RecognitionConstructor = new () => RecognitionLike;

export function getSpeechRecognitionConstructor(): RecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isWebSpeechSupported(): boolean {
  return getSpeechRecognitionConstructor() !== null;
}

function mapError(error: string): SpeechErrorCode {
  switch (error) {
    case "not-allowed":
    case "service-not-allowed":
      return "permission-denied";
    case "audio-capture":
      return "no-microphone";
    case "no-speech":
      return "no-speech";
    case "network":
      return "network";
    default:
      return "failed";
  }
}

export class WebSpeechRecognizer implements SpeechRecognizer {
  readonly engine = "web-speech" as const;
  private recognition: RecognitionLike | null = null;

  async start(handlers: SpeechHandlers): Promise<void> {
    const Recognition = getSpeechRecognitionConstructor();
    if (!Recognition) {
      handlers.onError("failed");
      handlers.onEnd();
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;

    let delivered = false;
    let failed = false;

    recognition.onresult = (event) => {
      const alternatives: string[] = [];
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        for (let j = 0; j < result.length; j++) {
          alternatives.push(result[j].transcript);
        }
      }
      delivered = true;
      handlers.onResult(alternatives);
    };

    recognition.onerror = (event) => {
      failed = true;
      if (event.error !== "aborted") {
        handlers.onError(mapError(event.error));
      }
    };

    recognition.onend = () => {
      this.recognition = null;
      if (!delivered && !failed) {
        handlers.onError("no-speech");
      }
      handlers.onEnd();
    };

    this.recognition = recognition;

    try {
      recognition.start();
    } catch {
      this.recognition = null;
      handlers.onError("failed");
      handlers.onEnd();
    }
  }

  stop(): void {
    this.recognition?.stop();
  }

  abort(): void {
    const recognition = this.recognition;
    if (!recognition) return;
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
    this.recognition = null;
    recognition.abort();
  }
}

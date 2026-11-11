import { useCallback, useEffect, useRef, useState } from "react";
import {
  createSpeechRecognizer,
  detectSpeechEngine,
  type SpeechEngine,
  type SpeechErrorCode,
  type SpeechRecognizer,
} from "../services/speech";

export type CaptureStatus = "idle" | "listening" | "processing";

export function describeSpeechError(code: SpeechErrorCode, detail?: string): string {
  switch (code) {
    case "permission-denied":
      return "O microfone está bloqueado neste site. Um adulto pode liberar o microfone ou confirmar a resposta.";
    case "no-microphone":
      return "Não encontramos um microfone neste aparelho. Um adulto pode confirmar a resposta.";
    case "no-speech":
      return "Não ouvi nada. Aperte em Gravar e fale de novo.";
    case "network":
      return detail || "Não consegui entender a fala agora. Verifique a internet e tente de novo.";
    default:
      return "Algo deu errado com o microfone. Tente de novo.";
  }
}

/**
 * Captura de fala para as atividades. Escolhe o motor (Web Speech, servidor ou assistido),
 * expõe o estado ("ouvindo", "processando") e entrega as transcrições candidatas.
 * Se o microfone for negado, passa sozinho para o modo assistido.
 */
export default function useSpeechCapture(onAlternatives: (alternatives: string[]) => void) {
  const [engine, setEngine] = useState<SpeechEngine>(() => detectSpeechEngine());
  const [status, setStatus] = useState<CaptureStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [micBlocked, setMicBlocked] = useState(false);
  const recognizerRef = useRef<SpeechRecognizer | null>(null);
  const callbackRef = useRef(onAlternatives);

  useEffect(() => {
    callbackRef.current = onAlternatives;
  });

  useEffect(() => () => recognizerRef.current?.abort(), []);

  const start = useCallback(async () => {
    const recognizer = createSpeechRecognizer(engine);
    if (!recognizer) return;

    setError(null);
    setStatus("listening");
    recognizerRef.current = recognizer;

    await recognizer.start({
      onResult: (alternatives) => callbackRef.current(alternatives),
      onProcessing: () => setStatus("processing"),
      onError: (code, detail) => {
        setError(describeSpeechError(code, detail));
        if (code === "permission-denied" || code === "no-microphone") {
          setMicBlocked(true);
          setEngine("assisted");
        }
      },
      onEnd: () => {
        if (recognizerRef.current === recognizer) recognizerRef.current = null;
        setStatus("idle");
      },
    });
  }, [engine]);

  const toggle = useCallback(() => {
    if (status === "listening") {
      recognizerRef.current?.stop();
    } else if (status === "idle") {
      void start();
    }
  }, [status, start]);

  const retryMicrophone = useCallback(() => {
    setMicBlocked(false);
    setError(null);
    setEngine(detectSpeechEngine());
  }, []);

  return {
    engine,
    status,
    isListening: status === "listening",
    isBusy: status !== "idle",
    error,
    micBlocked,
    toggle,
    retryMicrophone,
  };
}

export type SpeechCapture = ReturnType<typeof useSpeechCapture>;

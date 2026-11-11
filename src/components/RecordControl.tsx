import type { SpeechCapture } from "../hooks/useSpeechCapture";
import styles from "../assets/styles/css/feedback.module.css";

type RecordControlProps = {
  capture: SpeechCapture;
  /** Chamado quando um adulto confirma que a criança falou certo (modo assistido). */
  onAssistedCorrect: () => void;
  /** Chamado quando um adulto pede para tentar de novo (modo assistido). */
  onAssistedRetry?: () => void;
  /** Classe do botão de gravar, vinda de cada tela. */
  className?: string;
  disabled?: boolean;
  /** Este controle é o alvo da gravação em andamento (várias sílabas/palavras na mesma tela). */
  active?: boolean;
  /** Chamado antes de iniciar/parar a gravação, para marcar o alvo. */
  onToggle?: () => void;
  /** Nome do alvo para leitores de tela, como "sílaba ba". */
  targetLabel?: string;
};

/**
 * Botão de gravar com estado "ouvindo", mensagens de erro na tela e modo assistido,
 * em que um adulto confirma a resposta quando não há reconhecimento de fala.
 */
export default function RecordControl({
  capture,
  onAssistedCorrect,
  onAssistedRetry,
  className,
  disabled = false,
  active = true,
  onToggle,
  targetLabel,
}: RecordControlProps) {
  const listeningHere = active && capture.isListening;
  const busyHere = active && capture.status !== "idle";
  const suffix = targetLabel ? ` ${targetLabel}` : "";

  if (capture.engine === "assisted") {
    return (
      <div className={styles.assisted} role="group" aria-label={`Confirmação por um adulto${suffix}`}>
        {capture.error ? (
          <p role="alert">{capture.error}</p>
        ) : (
          <p>
            Este navegador não consegue ouvir a fala sozinho. Peça a um adulto para ouvir
            {targetLabel ? ` (${targetLabel})` : ""} e confirmar.
          </p>
        )}
        <button
          type="button"
          className={`${styles.assistedButton} ${styles.assistedYes}`}
          onClick={onAssistedCorrect}
          disabled={disabled}
        >
          <span aria-hidden="true">✅</span> A criança falou certo
        </button>
        <button
          type="button"
          className={`${styles.assistedButton} ${styles.assistedRetry}`}
          onClick={onAssistedRetry}
          disabled={disabled}
        >
          <span aria-hidden="true">🔁</span> Tentar de novo
        </button>
        {capture.micBlocked && (
          <button
            type="button"
            className={`${styles.assistedButton} ${styles.assistedRetry}`}
            onClick={capture.retryMicrophone}
          >
            <span aria-hidden="true">🎙️</span> Tentar usar o microfone
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        className={className}
        onClick={onToggle ?? capture.toggle}
        disabled={disabled || (capture.status === "processing") || (capture.isBusy && !active)}
        aria-label={`${listeningHere ? "Parar de gravar" : "Gravar"}${suffix}`}
      >
        <span aria-hidden="true">{listeningHere ? "⏹️" : "🎙️"}</span>
        <span aria-hidden="true">{listeningHere ? " Parar" : " Gravar"}</span>
      </button>

      <div role="status" aria-live="polite">
        {listeningHere && (
          <p className={styles.listening}>
            <span className={styles.dot} aria-hidden="true" /> Ouvindo… pode falar!
          </p>
        )}
        {busyHere && capture.status === "processing" && (
          <p className={styles.listening}>Entendendo a fala…</p>
        )}
      </div>

      {active && capture.error && (
        <p className={styles.error} role="alert">
          {capture.error}
        </p>
      )}
    </div>
  );
}

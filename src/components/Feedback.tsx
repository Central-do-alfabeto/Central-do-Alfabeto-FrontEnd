import styles from "../assets/styles/css/feedback.module.css";

export type FeedbackKind = "correct" | "wrong" | null;

const CONTENT = {
  correct: { icon: "✅", text: "Muito bem! Você acertou!" },
  wrong: { icon: "❌", text: "Quase! Vamos tentar de novo." },
} as const;

/**
 * Resultado da última tentativa, visível (cor, ícone e texto) e anunciado por leitores de tela.
 * A região ao vivo fica sempre na página para que a mudança seja anunciada.
 */
export default function Feedback({ kind }: { kind: FeedbackKind }) {
  return (
    <div className={styles.region} role="status" aria-live="polite">
      {kind && (
        <p className={`${styles.message} ${kind === "correct" ? styles.correct : styles.wrong}`}>
          <span aria-hidden="true">{CONTENT[kind].icon}</span> {CONTENT[kind].text}
        </p>
      )}
    </div>
  );
}

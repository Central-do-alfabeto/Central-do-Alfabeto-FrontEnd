import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { playAudio } from "../../utils/playAudio";
import { useAudioRunning } from "../../state/useAudioRunning";
import { useShowText } from "../../state/useShowText";
import styles from "../../assets/styles/css/first-presentation-section.module.css";

export default function FirstPresentationSection() {
  const [audioRunning, setAudioRunning] = useAudioRunning();
  const [showText] = useShowText();
  const navigate = useNavigate();

  useEffect(() => {
    if (!showText) {
      playAudio("introdução", setAudioRunning);
    }
  }, [showText, setAudioRunning]);

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Introdução</h1>
        {showText && <p className={styles.helperText}>Bem-vindo à Central do Alfabeto!</p>}

        <div className={styles.buttonRow}>
          <button
            type="button"
            className={styles.primaryButton}
            disabled={audioRunning}
            onClick={() => navigate("/GameSectionPresentation")}
          >
            <span aria-hidden="true">➡️</span>
            <span> Continuar apresentação</span>
          </button>

          <button
            type="button"
            className={styles.secondaryButton}
            disabled={audioRunning}
            onClick={() => navigate("/PlayerMenu")}
          >
            <span aria-hidden="true">⬅️</span>
            <span> Ir para o menu do aluno</span>
          </button>

        </div>
      </div>
    </section>
  );
}

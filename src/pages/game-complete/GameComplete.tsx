import { useNavigate } from "react-router-dom";
import { setInGameFlow } from "../../store/gameState";
import { useAudioRunning } from "../../state/useAudioRunning";
import { useShowText } from "../../state/useShowText";
import useOneShotAudio from "../../hooks/useOneShotAudio";
import styles from "../../assets/styles/css/game-section-congratulations.module.css";

export default function GameComplete() {
  const [showText] = useShowText();
  const [audioRunning, setAudioRunning] = useAudioRunning();
  const navigate = useNavigate();

  useOneShotAudio(!showText, "fim_de_jogo", setAudioRunning);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <p
          className={styles.message}
          role="status"
          aria-label="Parabéns! Você aprendeu todas as letras do alfabeto!"
        >
          <span aria-hidden="true" style={{ display: "block", fontSize: "56px" }}>
            🏆
          </span>
          {showText && <>Parabéns! Você aprendeu todas as letras do alfabeto! 🎉</>}
        </p>

        <div className={styles.buttonRow}>
          <button
            type="button"
            className={styles.returnButton}
            onClick={() => {
              setInGameFlow(false);
              navigate("/PlayerMenu");
            }}
            disabled={audioRunning}
          >
            <span aria-hidden="true">⬅️</span>
            {showText && <span> Voltar ao menu</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

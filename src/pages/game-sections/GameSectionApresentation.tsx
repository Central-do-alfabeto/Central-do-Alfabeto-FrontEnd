import { Letters } from "../../store/gameConstants";
import { currentPhaseIndex } from "../../store/gameState";
import { useNavigate } from "react-router-dom";
import { playAudio } from "../../utils/playAudio";
import { useEffect } from "react";
import styles from "../../assets/styles/css/game-section-apresentation.module.css";

export default function GameSectionApresentation() {
  const navigate = useNavigate();

  useEffect(() => {
    playAudio("AudioApresentation");
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section
          className={styles.letter}
          onClick={() => playAudio(`AuxLetter${Letters[currentPhaseIndex]}`, true)}
        >
          {Letters[currentPhaseIndex]}
        </section>

        <button
          className={styles.startButton}
          onClick={() => navigate("/Section1")}
        >
          Iniciar Sessão
        </button>

        <button
          className={styles.returnButton}
          onClick={() => navigate("/PlayerMenu")}
        >
          Voltar ao menu
        </button>
      </div>
    </div>
  );
}

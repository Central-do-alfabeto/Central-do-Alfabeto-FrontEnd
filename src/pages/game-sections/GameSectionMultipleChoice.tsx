import { currentPhaseIndex, incrementTotalErrors } from "../../store/gameState";
import { Letters } from "../../store/gameConstants";
import { useState, useEffect } from "react";
import { playAudio } from "../../utils/playAudio";
import { useNavigate } from "react-router-dom";
import optionsForPhase from "../../utils/randomLetterGenerator";
import styles from "../../assets/styles/css/game-section-multiple-choice.module.css"; // ✅ Import local

export default function GameSectionMultipleChoice() {
  const [options, setOptions] = useState<string[]>([]);
  const [canGoNext, setCanGoNext] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setOptions(optionsForPhase());
    setCanGoNext(false);
    playAudio('Section2');
  }, []);

  const handleClick = (value: string) => {
    if (value === Letters[currentPhaseIndex]) {
      setCanGoNext(true);
    } else {
      wrongAnswer();
    }
  };

  function wrongAnswer() {
    incrementTotalErrors();
    playAudio("Section2WrongAnswer");
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Fase {currentPhaseIndex}</h1>

        <button
          
          title="Reproduzir som da fase"
          onClick={() => { playAudio("Section2", true)}}
        >
          ▶ Ouvir de novo
        </button>

        <div className={styles.options}>
          {options.map((option, idx) => (
            <button
              key={idx}
              className={styles["option-button"]}
              onClick={() => handleClick(option)}
              disabled={canGoNext}
            >
              {option}
            </button>
          ))}
        </div>

        <button
          className={styles["next-button"]}
          onClick={() => navigate("/GameSectionFinal")}
          disabled={!canGoNext}
        >
          Próxima fase
        </button>

        <button
          className={styles["return-button"]}
          onClick={() => navigate("/PlayerMenu")}
        >
          retornar
        </button>
      </div>
    </div>
  );
}

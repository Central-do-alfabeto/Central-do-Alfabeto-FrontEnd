import { currentPhaseIndex, incrementTotalErrors } from "../../store/gameState";
import { Letters } from "../../store/gameConstants";
import { useState, useEffect } from "react";
import { playAudio } from "../../utils/playAudio";
import { useNavigate } from "react-router-dom";
import optionsForPhase from "../../utils/randomLetterGenerator";
import { useAudioRunning } from "../../state/useAudioRunning";
import { useShowText } from "../../state/useShowText";
import useSectionRedirect from "../../hooks/useSectionRedirect";
import useOneShotAudio from "../../hooks/useOneShotAudio";
import styles from "../../assets/styles/css/game-section-multiple-choice.module.css";

export default function GameSectionMultipleChoice() {
  const [options, setOptions] = useState<string[]>([]);
  const [canGoNext, setCanGoNext] = useState(false);

  const navigate = useNavigate();
  const [audioRunning, setAudioRunning] = useAudioRunning();
  const [showText] = useShowText();
  const { redirect } = useSectionRedirect();
  const audioName = `MultiplaEscolha${Letters[currentPhaseIndex]}`;

  useEffect(() => {
    setOptions(optionsForPhase());
    setCanGoNext(false);
  }, []);

  useOneShotAudio(!showText, audioName, setAudioRunning);

  const handleClick = (value: string) => {
    if (value === Letters[currentPhaseIndex]) {
      setCanGoNext(true);
      playAudio("resposta_correta", setAudioRunning, true);
    } else {
      wrongAnswer();
    }
  };

  function wrongAnswer() {
    incrementTotalErrors();
    playAudio("resposta_errada", setAudioRunning, true); // COMENTÁRIO DO BRIAN: Precisa de um áudio de resposta errada pra isso aqui também
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {showText && (
          <p className={styles.helperText}>Escolha a letra correta para continuar! 📝</p>
        )}

        <h1 className={styles.title}>Fase {currentPhaseIndex}</h1>

        <button
          className={styles.repeatButton}
          title="Reproduzir som da fase"
          onClick={() => playAudio(audioName, setAudioRunning, true)}
          disabled={audioRunning}
        >
          <span aria-hidden="true">▶️</span>
          {showText && <span> Ouvir de novo</span>}
        </button>

        <div className={styles.options}>
          {options.map((option, idx) => (
            <button
              key={idx}
              className={styles.optionButton}
              onClick={() => handleClick(option)}
              disabled={canGoNext || audioRunning}
              aria-label={`Selecionar a opção ${option}`}
            >
              {option}
            </button>
          ))}
        </div>

        <button
          className={styles.nextButton}
          onClick={() => redirect("GameSectionMultipleChoice")}
          disabled={!canGoNext || audioRunning}
          aria-label="Ir para a próxima fase"
        >
          <span aria-hidden="true">➡️</span>
          {showText && <span> Próxima fase</span>}
        </button>

        <button
          className={styles.returnButton}
          onClick={() => navigate("/PlayerMenu")}
          disabled={audioRunning}
          aria-label="Retornar ao menu do jogador"
        >
          <span aria-hidden="true">⬅️</span>
          {showText && <span> Retornar</span>}
        </button>
      </div>
    </div>
  );
}

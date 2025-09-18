import { currentPhaseIndex, incrementTotalErrors } from "../../store/gameState";
import { Letters } from "../../store/gameConstants";
import { useState, useEffect } from "react";
import { playAudio } from "../../utils/playAudio";
import { useNavigate } from "react-router-dom";
import optionsForPhase from "../../utils/randomLetterGenerator";
import { useAudioRunning } from "../../state/useAudioRunning";
import { useShowText } from "../../state/useShowText";
import useSectionRedirect from "../../hooks/useSectionRedirect";

export default function GameSectionMultipleChoice() {
  const [options, setOptions] = useState<string[]>([]);
  const [canGoNext, setCanGoNext] = useState(false);

  const navigate = useNavigate();
  const [audioRunning, setAudioRunning] = useAudioRunning();
  const [showText] = useShowText();
  const { redirect } = useSectionRedirect();

  useEffect(() => {
    setOptions(optionsForPhase());
    setCanGoNext(false);

    if (!showText) {
      playAudio("Section2", setAudioRunning);
    }
  }, [showText, setAudioRunning]);

  const handleClick = (value: string) => {
    if (value === Letters[currentPhaseIndex]) {
      setCanGoNext(true);
    } else {
      wrongAnswer();
    }
  };

  function wrongAnswer() {
    incrementTotalErrors();
    playAudio("Section2WrongAnswer", setAudioRunning, true);
  }

  return (
    <div>
      {showText && <p>Escolha a letra correta para continuar! 📝</p>}

      {/* Título mostrando a fase atual */}
      <h1>Fase {currentPhaseIndex}</h1>

      {/* Botão para ouvir novamente o som da fase */}
      <button
        title="Reproduzir som da fase"
        onClick={() => playAudio("Section2", setAudioRunning, true)}
        disabled={audioRunning}
      >
        ▶️ Ouvir de novo
      </button>

      {/* Botões com as opções de letras */}
      <div>
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(option)}
            disabled={canGoNext || audioRunning}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Botão para ir para a próxima fase */}
      <button
        onClick={() => redirect("GameSectionMultipleChoice")}
        disabled={!canGoNext || audioRunning}
      >
        {showText && <div>Próxima fase</div>}
      </button>

      <button onClick={() => navigate("/PlayerMenu")} disabled={audioRunning}>
        {showText && <div>Retornar</div>}
      </button>
    </div>
  );
}

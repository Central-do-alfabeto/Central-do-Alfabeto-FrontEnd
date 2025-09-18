import { currentPhaseIndex, incrementTotalErrors } from "../../store/gameState";
import { Letters } from "../../store/gameConstants";
import { useState, useEffect } from "react";
import { playAudio } from "../../utils/playAudio";
import { useNavigate } from "react-router-dom";
import optionsForPhase from "../../utils/randomLetterGenerator";

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
    <div>
      {/* Título mostrando a fase atual */}
      <h1>Fase {currentPhaseIndex}</h1>

      {/* Botão para ouvir novamente o som da fase */}
      <button title="Reproduzir som da fase" onClick={() => { playAudio("Section2", true)}}>
        ▶️ Ouvir de novo
      </button>

      {/* Botões com as opções de letras */}
      <div>
        {options.map((option, idx) => (
          <button key={idx} onClick={() => handleClick(option)} disabled={canGoNext}>
            {option}
          </button>
        ))}
      </div>

      {/* Botão para ir para a próxima fase, só habilitado se acertou */}
      <button onClick={() => navigate("/GameSectionFinal")} disabled={!canGoNext}>
        Próxima fase
      </button>
      <button onClick={() => navigate("/PlayerMenu")}>retornar</button>
    </div>
  );
}

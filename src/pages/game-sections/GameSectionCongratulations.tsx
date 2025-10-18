import { useEffect } from "react";
import { playAudio } from "../../utils/playAudio";
import { useNavigate } from "react-router-dom";
import { setCurrentPhaseIndex, resetTotalValues, currentPhaseIndex } from "../../store/gameState";
import { useAudioRunning } from "../../state/useAudioRunning";
import { useShowText } from "../../state/useShowText";
import { playerDataUpdate } from "../../services/api/playerDataUpdate";
import { Letters } from "../../store/gameConstants"; 
import styles from "../../assets/styles/css/game-section-congratulations.module.css";

export default function GameSectionCongratulations() {
  const [showText] = useShowText();
  const [audioRunning, setAudioRunning] = useAudioRunning();
  const navigate = useNavigate();
  
  // 1. Definição da letra e construção do nome do áudio
  const completedLetter = Letters[currentPhaseIndex]; 
  const congratulationAudioName = `Parabens_aprendeu_${completedLetter}`;


  useEffect(() => {
    if (!showText) {
      // 2. Toca o áudio de parabéns
      playAudio(congratulationAudioName, setAudioRunning);
    }
    
    // As chamadas abaixo gerenciam o estado e a persistência dos dados
    playerDataUpdate();
    resetTotalValues();
    setCurrentPhaseIndex(1);
    
  // 3. Adiciona o nome do áudio às dependências
  }, [showText, setAudioRunning, congratulationAudioName]); 

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {showText && (
          <p className={styles.message}>
            Parabéns! Você completou a letra {completedLetter}! 🎉
          </p>
        )}

        <div className={styles.buttonRow}>
          <button
            type="button"
            className={styles.nextButton}
            onClick={() => navigate("/GameSectionPresentation")}
            disabled={audioRunning}
          >
            <span aria-hidden="true">➡️</span>
            {showText && <span> Próxima fase</span>}
          </button>

          <button
            type="button"
            className={styles.returnButton}
            onClick={() => navigate("/PlayerMenu")}
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

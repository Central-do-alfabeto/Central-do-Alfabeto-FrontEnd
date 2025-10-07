import { useEffect } from "react";
import { playAudio } from "../../utils/playAudio";
import { useNavigate } from "react-router-dom";
import { setCurrentPhaseIndex, resetTotalValues, currentPhaseIndex } from "../../store/gameState";
import { useAudioRunning } from "../../state/useAudioRunning";
import { useShowText } from "../../state/useShowText";
import { playerDataUpdate } from "../../services/api/playerDataUpdate";
import { Letters } from "../../store/gameConstants"; 

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
    <div>
      <div className="congratulations">
        {/* Placeholder de texto ou imagem */}
        {showText && <p>Parabéns! Você completou a letra {completedLetter}! 🎉</p>}
      </div>

      <button
        className="section2"
        onClick={() => navigate("/GameSectionPresentation")}
        disabled={audioRunning} // Desativa botão enquanto áudio toca
      >
        {showText && <div>Próxima fase</div>}
      </button>

      <button
        onClick={() => navigate("/PlayerMenu")}
        disabled={audioRunning}
      >
        {showText && <div>Voltar ao menu</div>}
      </button>
    </div>
  );
}

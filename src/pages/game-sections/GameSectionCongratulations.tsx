import { useEffect } from "react";
import { playAudio } from "../../utils/playAudio";
import { useNavigate } from "react-router-dom";
import { setCurrentPhaseIndex, resetTotalValues } from "../../store/gameState";
import { useAudioRunning } from "../../state/useAudioRunning";
import { useShowText } from "../../state/useShowText";
import { playerDataUpdate } from "../../services/api/playerDataUpdate";

export default function GameSectionCongratulations() {
  const [showText] = useShowText();
  const [audioRunning, setAudioRunning] = useAudioRunning();
  const navigate = useNavigate();

  useEffect(() => {
    if (!showText) {
      // reproduz áudio apenas se showText for false
      playAudio(`SectionCongratulations`, setAudioRunning);
    }
    playerDataUpdate();
    resetTotalValues();
    setCurrentPhaseIndex(1);
  }, [showText, setAudioRunning]);

  return (
    <div>
      <div className="congratulations">
        {/* Placeholder de texto ou imagem */}
        {showText && <p>Parabéns! Você completou esta fase! 🎉</p>}
      </div>

      <button
        className="section2"
        onClick={() => navigate("/GameSectionPresentation")}
        disabled={audioRunning} // desativa botão enquanto áudio toca
      >
        {showText && <div>Próxima fase</div>}
      </button>

      <button
        onClick={() => navigate("/PlayerMenu")}
        disabled={audioRunning} // desativa botão enquanto áudio toca
      >
        {showText && <div>Voltar ao menu</div>}
      </button>
    </div>
  );
}

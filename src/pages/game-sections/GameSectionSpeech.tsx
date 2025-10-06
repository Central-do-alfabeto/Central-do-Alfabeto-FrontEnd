import { currentPhaseIndex, incrementTotalErrors } from "../../store/gameState";
import { Letters } from "../../store/gameConstants";
import { useState, useEffect } from "react";
import { playAudio } from "../../utils/playAudio";
import { useNavigate } from "react-router-dom";
import useRecorder from "../../hooks/useRecorder";
import sendRecording from "../../services/api/sendRecording";
import "../../assets/styles/css/game-section-speech.css";

export default function GameSectionSpeech() {
  const [canGoNext, setCanGoNext] = useState(false);
  const { isRecording, toggleRecording } = useRecorder(handleResult);
  const navigate = useNavigate();

  async function handleResult(audioBlob: Blob) {
    const result = await sendRecording(audioBlob);
    if (result === Letters[currentPhaseIndex]) {
      setCanGoNext(true);
    } else {
      incrementTotalErrors();
      setCanGoNext(false);
      playAudio(`Helper${currentPhaseIndex}`);
    }
  }

  useEffect(() => {
    setCanGoNext(false);
    playAudio("Section1");
  }, []);

  return (
    <div className="speech-page">
      {/* Ícones no canto superior direito */}
      <div className="menu-icons">
        <button onClick={() => playAudio(`AuxLetter${Letters[currentPhaseIndex]}`, true)}>
          <img src="/src/assets/images/sound-icon.png" alt="Som" />
        </button>
        <button onClick={() => navigate("/GameConfig")}>
          <img src="/src/assets/images/settings-icon.png" alt="Configurações" />
        </button>
      </div>

      {/* Painel central */}
      <div className="speech-container">
        <div
          className="letter-display"
          onClick={() => playAudio(`AuxLetter${Letters[currentPhaseIndex]}`, true)}
        >
          {Letters[currentPhaseIndex]}
        </div>

        <div className="button-row">
          <button
            className="record-button"
            id="startRecordingLetter"
            onClick={toggleRecording}
            disabled={canGoNext}
          >
            {isRecording ? "⏹️ Parar" : "🎙️ Gravar"}
          </button>

          <button
            className="next-button"
            disabled={!canGoNext}
            onClick={() => navigate("/Section2")}
          >
            Próxima fase
          </button>
        </div>

        <button className="return-button" onClick={() => navigate("/PlayerMenu")}>
          Voltar ao menu
        </button>
      </div>
    </div>
  );
}

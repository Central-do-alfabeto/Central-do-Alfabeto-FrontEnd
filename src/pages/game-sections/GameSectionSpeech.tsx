import { currentPhaseIndex, incrementTotalErrors } from "../../store/gameState";
import { Letters } from "../../store/gameConstants";
import { useState, useEffect } from "react";
import { playAudio } from "../../utils/playAudio";
import { useNavigate } from "react-router-dom";
import useRecorder from "../../hooks/useRecorder";
import sendRecording from "../../services/api/sendRecording";
import { useAudioRunning } from "../../state/useAudioRunning";
import { useShowText } from "../../state/useShowText";
import useSectionRedirect from "../../hooks/useSectionRedirect";

export default function GameSectionSpeech() {
  const [canGoNext, setCanGoNext] = useState(false);
  const { isRecording, toggleRecording } = useRecorder(handleResult);
  const navigate = useNavigate();
  const [audioRunning, setAudioRunning] = useAudioRunning();
  const [showText] = useShowText();
  const { redirect } = useSectionRedirect();

  // 🔥 callback para tratar o resultado do backend
  async function handleResult(audioBlob: Blob) {
    const result = await sendRecording(audioBlob);

    if (result === Letters[currentPhaseIndex]) {
      setCanGoNext(true); // libera "Próxima fase"
    } else {
      incrementTotalErrors();
      setCanGoNext(false); // mantém bloqueado
      playAudio(`Helper${currentPhaseIndex}`, setAudioRunning, true);
    }
  }

  useEffect(() => {
    setCanGoNext(false);
    if (!showText) {
      playAudio("Section1", setAudioRunning);
    }
  }, [showText, setAudioRunning]);

  return (
    <div>
      {showText && (
        <p>Clique na letra e grave sua pronúncia corretamente para continuar! 🎤</p>
      )}

      <div
        className="letra"
        onClick={() =>
          playAudio(
            `AuxLetter${Letters[currentPhaseIndex]}`,
            setAudioRunning,
            true
          )
        }
      >
        {Letters[currentPhaseIndex]}
      </div>

      {/* Botão Gravar (bloqueia se acertou ou se áudio está tocando) */}
      <button
        id="startRecordingLetter"
        onClick={toggleRecording}
        disabled={canGoNext || audioRunning}
      >
        {isRecording ? "⏹️ Parar" : "🎙️ Gravar"}
      </button>

      {/* Botão Próxima fase (desbloqueia apenas se acertou e áudio não está tocando) */}
      <button
        className="section2"
        disabled={!canGoNext || audioRunning}
        onClick={() => redirect("GameSectionSpeech")}
      >
        {showText && <div>Próxima fase</div>}
      </button>

      <button onClick={() => navigate("/PlayerMenu")} disabled={audioRunning}>
        {showText && <div>Retornar</div>}
      </button>
    </div>
  );
}

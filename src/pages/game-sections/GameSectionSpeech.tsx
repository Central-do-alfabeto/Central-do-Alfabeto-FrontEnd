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
import { matchesExpectedSpeech } from "../../utils/speechUtils";

export default function GameSectionSpeech() {
  const [canGoNext, setCanGoNext] = useState(false);
  const { isRecording, toggleRecording } = useRecorder(handleResult);
  const navigate = useNavigate();
  const [audioRunning, setAudioRunning] = useAudioRunning();
  const [showText] = useShowText();
  const { redirect } = useSectionRedirect();

  const letter = Letters[currentPhaseIndex];
  
  const presentationAudioName = `essa_letra_${letter}_alfabeto`; 
  
  const helperAudioName = `Helper${currentPhaseIndex}`;

  // Callback para tratar o resultado do back-end
  async function handleResult(audioBlob: Blob) {
    try {
      const transcript = await sendRecording(audioBlob);
      const expected = Letters[currentPhaseIndex];

      if (matchesExpectedSpeech(transcript, expected)) {
        setCanGoNext(true);
      } else {
        incrementTotalErrors();
        setCanGoNext(false);
        playAudio(`Helper${currentPhaseIndex}`, setAudioRunning, true);
      }
    } catch (error) {
      console.error("Falha ao processar áudio:", error);
      incrementTotalErrors();
      setCanGoNext(false);
    }
  }

  useEffect(() => {
    setCanGoNext(false);
    if (!showText) {
      playAudio("repita_letra_mostrada", setAudioRunning);
    }
  }, [showText, setAudioRunning, helperAudioName]); 

  return (
    <div>
      {showText && (
        <p>Clique na letra e grave sua pronúncia corretamente para continuar! 🎤</p>
      )}

      <div
        className="letra"
        onClick={() =>
          playAudio(
            presentationAudioName,
            setAudioRunning,
            true
          )
        }
      >
        {letter}
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

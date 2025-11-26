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
import styles from "../../assets/styles/css/game-section-speech.module.css";

export default function GameSectionSpeech() {
  const [canGoNext, setCanGoNext] = useState(false);
  const { isRecording, toggleRecording } = useRecorder(handleResult);
  const navigate = useNavigate();
  const [audioRunning, setAudioRunning] = useAudioRunning();
  const [showText] = useShowText();
  const { redirect } = useSectionRedirect();

  const letter = Letters[currentPhaseIndex];
  
  const presentationAudioName = `essa_letra_${letter}_alfabeto`; 
  
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
        playAudio("resposta_errada", setAudioRunning, true);
      }
    } catch (error) {
      console.error("Falha ao processar áudio:", error);
      if (error instanceof Error) {
        alert(error.message);
      }
      setCanGoNext(false);
    }
  }

  useEffect(() => {
    setCanGoNext(false);
    if (!showText) {
      playAudio("repita_letra_mostrada", setAudioRunning);
    }
  }, [showText, setAudioRunning]); 

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {showText && (
          <p className={styles.helperText}>
            Clique na letra e grave sua pronúncia corretamente para continuar! 🎤
          </p>
        )}

        <div
          className={styles.letterDisplay}
          onClick={() =>
            playAudio(
              presentationAudioName,
              setAudioRunning,
              true
            )
          }
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              playAudio(
                presentationAudioName,
                setAudioRunning,
                true
              );
            }
          }}
        >
          {letter}
        </div>

        <div className={styles.buttonRow}>
          <button
            type="button"
            id="startRecordingLetter"
            className={styles.recordButton}
            onClick={toggleRecording}
            disabled={canGoNext || audioRunning}
          >
            <span aria-hidden="true">{isRecording ? "⏹️" : "🎙️"}</span>
            <span>{isRecording ? " Parar" : " Gravar"}</span>
          </button>

          <button
            type="button"
            className={styles.nextButton}
            disabled={!canGoNext || audioRunning}
            onClick={() => redirect("GameSectionSpeech")}
            aria-label="Ir para a próxima fase"
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
            {showText && <span> Retornar</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

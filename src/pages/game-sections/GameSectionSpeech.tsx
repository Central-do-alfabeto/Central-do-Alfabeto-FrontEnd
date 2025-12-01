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
import useOneShotAudio from "../../hooks/useOneShotAudio";
import styles from "../../assets/styles/css/game-section-speech.module.css";

export default function GameSectionSpeech() {
  const [canGoNext, setCanGoNext] = useState(false);
  const { isRecording, toggleRecording } = useRecorder(handleResult);
  const navigate = useNavigate();
  const [audioRunning, setAudioRunning] = useAudioRunning();
  const [showText] = useShowText();
  const { redirect } = useSectionRedirect();

  const activeLetter = Letters[currentPhaseIndex];
  const letter = activeLetter.letter;
  const acceptedPronunciations = activeLetter.pronunciations;

  const presentationAudioName = `essa_letra_${letter}_alfabeto`; 

  // Callback para tratar o resultado do back-end
  async function handleResult(audioBlob: Blob) {
    try {
      const transcript = await sendRecording(audioBlob);
      const expected = letter;

      console.info(
        "Transcrição recebida pelo Vosk (GameSectionSpeech):",
        transcript,
        "| Letra esperada:",
        expected,
        "| Pronúncias aceitas:",
        acceptedPronunciations
      );

      if (matchesExpectedSpeech(transcript, expected, acceptedPronunciations)) {
        setCanGoNext(true);
        playAudio("resposta_correta", setAudioRunning);
      } else {
        incrementTotalErrors();
        setCanGoNext(false);
        playAudio("resposta_errada", setAudioRunning);
      }
    } catch (error) {
      console.error("Falha ao processar áudio:", error);
      if (error instanceof Error) {
        const friendlyMessage = error.message?.trim()
          ? error.message
          : "Não foi possível processar o áudio. Tente novamente.";
        alert(friendlyMessage);
      }
      setCanGoNext(false);
    }
  }

  useEffect(() => {
    setCanGoNext(false);
  }, [currentPhaseIndex]);

  useOneShotAudio(!showText, "repita_letra_mostrada", setAudioRunning);

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
          onClick={() => {
            if (audioRunning) {
              return;
            }
            playAudio(
              presentationAudioName,
              setAudioRunning,
              true
            );
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              if (audioRunning) {
                return;
              }
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
           <div className={styles.recordButtonContainer}>
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
          </div>
          <div className={styles.ButtonContainer}>
            <button
              type="button"
              className={styles.returnButton}
              onClick={() => navigate("/PlayerMenu")}
              disabled={audioRunning}
            >
              <span aria-hidden="true">⬅️</span>
              {showText && <span> Retornar</span>}
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
          </div>
        </div>
      </div>
    </div>
  );
}

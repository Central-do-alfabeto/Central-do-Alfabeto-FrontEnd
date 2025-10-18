import { Letters } from "../../store/gameConstants";
import { currentPhaseIndex, incrementTotalErrors } from "../../store/gameState";
import { playAudio } from "../../utils/playAudio";
import { useState, useEffect } from "react";
import useRecorder from "../../hooks/useRecorder";
import { useNavigate } from "react-router-dom";
import sendRecording from "../../services/api/sendRecording";
import { useAudioRunning } from "../../state/useAudioRunning";
import { useShowText } from "../../state/useShowText";
import useSectionRedirect from "../../hooks/useSectionRedirect";
import { matchesExpectedSpeech } from "../../utils/speechUtils";
import styles from "../../assets/styles/css/game-section-speech-syllable.module.css";

export default function GameSectionSpeechSyllable() {
  const [canGoNextWords, setCanGoNextWords] = useState([false, false, false, false, false]);
  const [canGoNext, setCanGoNext] = useState(false);
  const [clickedWord, setClickedWord] = useState("");
  const { isRecording, toggleRecording } = useRecorder(handleResult);
  const navigate = useNavigate();
  const [audioRunning, setAudioRunning] = useAudioRunning();
  const [showText] = useShowText();
  const { redirect } = useSectionRedirect();

  const letter = Letters[currentPhaseIndex];
  const syllables = ["a", "e", "i", "o", "u"].map((v) => `${letter}${v}`);
  const helperAudioName = `Helper${currentPhaseIndex}_GameSectionSpeechSyllable`; // COMENTÁRIO DO BRIAN: Precisa de um áudio de erro aqui

  async function handleResult(audioBlob: Blob) {
    try {
      const transcript = await sendRecording(audioBlob);
      const idx = syllables.indexOf(clickedWord);

      if (idx !== -1 && matchesExpectedSpeech(transcript, clickedWord)) {
        setCanGoNextWords((prev) => {
          const updated = [...prev];
          updated[idx] = true;
          const allDone = updated.every(Boolean);
          setCanGoNext(allDone);
          return updated;
        });
      } else {
        incrementTotalErrors();
        setCanGoNext(false);
        playAudio(
          `Helper${currentPhaseIndex}_GameSectionSpeechSyllable`,
          setAudioRunning,
          true
        );
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
      playAudio(`silaba_${syllables[0]}`, setAudioRunning);
    }
  }, [showText, setAudioRunning, helperAudioName, syllables]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <form
          className={styles.form}
          onSubmit={(event) => event.preventDefault()}
        >
          {showText && (
            <p className={styles.helperText}>Grave cada sílaba corretamente para continuar! 🎤</p>
          )}

          {syllables.map((syll, idx) => (
            <div className={styles.syllableGroup} key={syll}>
              <div
                className={styles.syllable}
                onClick={() => playAudio(`silaba_${syll}`, setAudioRunning, true)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    playAudio(`silaba_${syll}`, setAudioRunning, true);
                  }
                }}
              >
                {syll}
              </div>
              <button
                type="button"
                className={styles.recordButton}
                onClick={() => {
                  toggleRecording();
                  setClickedWord(syll);
                }}
                disabled={
                  canGoNextWords[idx] ||
                  (isRecording && clickedWord !== syll) ||
                  audioRunning
                }
              >
                <span aria-hidden="true">{isRecording && clickedWord === syll ? "⏹️" : "🎙️"}</span>
                <span>{isRecording && clickedWord === syll ? " Parar" : " Gravar"}</span>
              </button>
            </div>
          ))}

          <button
            type="button"
            className={styles.nextButton}
            disabled={!canGoNext || audioRunning}
            onClick={() => redirect("GameSectionSpeechSyllable")}
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
        </form>
      </div>
    </div>
  );
}

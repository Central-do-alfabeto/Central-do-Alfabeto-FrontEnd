import useRecorder from "../../hooks/useRecorder";
import { Words } from "../../store/gameConstants";
import { currentPhaseIndex, incrementTotalErrors } from "../../store/gameState";
import { useState, useEffect } from "react";
import sendRecording from "../../services/api/sendRecording";
import { playAudio } from "../../utils/playAudio";
import { useNavigate } from "react-router-dom";
import { useAudioRunning } from "../../state/useAudioRunning";
import { useShowText } from "../../state/useShowText";
import useSectionRedirect from "../../hooks/useSectionRedirect";
import styles from "../../assets/styles/css/game-section-final.module.css";

export default function GameSectionFinal() {
  const [canGoNextWord1, setCanGoNext1] = useState(false);
  const [canGoNextWord2, setCanGoNext2] = useState(false);
  const [canGoNextWord3, setCanGoNext3] = useState(false);
  const [canGoNext, setCanGoNext] = useState(false);
  const [clickedWord, setClickedWord] = useState("");
  const [audioRunning, setAudioRunning] = useAudioRunning();
  const [showText] = useShowText();
  const { isRecording, toggleRecording } = useRecorder(handleResult);
  const { redirect } = useSectionRedirect();
  const navigate = useNavigate();

  const word1 = Words[currentPhaseIndex].word1;
  const word2 = Words[currentPhaseIndex].word2;
  const word3 = Words[currentPhaseIndex].word3;

  async function handleResult(audioBlob: Blob) {
    try {
      const result = await sendRecording(audioBlob);

      if (result === clickedWord) {
        if (clickedWord === word1) setCanGoNext1(true);
        if (clickedWord === word2) setCanGoNext2(true);
        if (clickedWord === word3) setCanGoNext3(true);
      } else {
        playAudio(`Helper${currentPhaseIndex}`, setAudioRunning, true);
        incrementTotalErrors();
      }

      setCanGoNext(
        (clickedWord === word1 ? true : canGoNextWord1) &&
        (clickedWord === word2 ? true : canGoNextWord2) &&
        (clickedWord === word3 ? true : canGoNextWord3)
      );
    } catch (error) {
      console.error("Falha ao processar áudio:", error);
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  useEffect(() => {
    setCanGoNext(false);
    if (!showText) {
      playAudio("repita_palavra_mostrada", setAudioRunning);
    }
  }, [showText, setAudioRunning]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          {showText && (
            <p className={styles.helperText}>
              Grave cada palavra corretamente para continuar! 🎯
            </p>
          )}

          <div className={styles.wordRow}>
            {/* Bloco 1 */}
            <div className={styles.wordBlock}>
              <label
                className={styles.wordLabel}
                onClick={() => playAudio(`palavra_${word1}`, setAudioRunning, true)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    playAudio(`palavra_${word1}`, setAudioRunning, true);
                  }
                }}
              >
                {word1}
              </label>
              <button
                type="button"
                id="startRecordingWord1"
                className={styles.recordButton}
                onClick={() => {
                  toggleRecording();
                  setClickedWord(word1);
                }}
                disabled={canGoNextWord1 || (isRecording && clickedWord !== word1) || audioRunning}
              >
                {isRecording && clickedWord === word1 ? "⏹️ Parar" : "🎙️ Gravar"}
              </button>
            </div>

            {/* Bloco 2 */}
            <div className={styles.wordBlock}>
              <label
                className={styles.wordLabel}
                onClick={() => playAudio(`palavra_${word2}`, setAudioRunning, true)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    playAudio(`palavra_${word2}`, setAudioRunning, true);
                  }
                }}
              >
                {word2}
              </label>
              <button
                type="button"
                id="startRecordingWord2"
                className={styles.recordButton}
                onClick={() => {
                  toggleRecording();
                  setClickedWord(word2);
                }}
                disabled={canGoNextWord2 || (isRecording && clickedWord !== word2) || audioRunning}
              >
                {isRecording && clickedWord === word2 ? "⏹️ Parar" : "🎙️ Gravar"}
              </button>
            </div>

            {/* Bloco 3 */}
            <div className={styles.wordBlock}>
              <label
                className={styles.wordLabel}
                onClick={() => playAudio(`palavra_${word3}`, setAudioRunning, true)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    playAudio(`palavra_${word3}`, setAudioRunning, true);
                  }
                }}
              >
                {word3}
              </label>
              <button
                type="button"
                id="startRecordingWord3"
                className={styles.recordButton}
                onClick={() => {
                  toggleRecording();
                  setClickedWord(word3);
                }}
                disabled={canGoNextWord3 || (isRecording && clickedWord !== word3) || audioRunning}
              >
                {isRecording && clickedWord === word3 ? "⏹️ Parar" : "🎙️ Gravar"}
              </button>
            </div>
          </div>

          <button
            type="button"
            className={styles.nextButton}
            disabled={!canGoNext || audioRunning}
            onClick={() => redirect("/GameSectionFinal")}
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
        </form>
      </div>
    </div>
  );
}

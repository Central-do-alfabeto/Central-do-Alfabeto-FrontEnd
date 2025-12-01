import useRecorder from "../../hooks/useRecorder";
import { Words, type WordKey } from "../../store/gameConstants";
import { currentPhaseIndex, incrementTotalErrors } from "../../store/gameState";
import { useState, useEffect, useRef } from "react";
import sendRecording from "../../services/api/sendRecording";
import { playAudio } from "../../utils/playAudio";
import { matchesExpectedSpeech } from "../../utils/speechUtils";
import { useNavigate } from "react-router-dom";
import { useAudioRunning } from "../../state/useAudioRunning";
import { useShowText } from "../../state/useShowText";
import useSectionRedirect from "../../hooks/useSectionRedirect";
import styles from "../../assets/styles/css/game-section-final.module.css";
import useOneShotAudio from "../../hooks/useOneShotAudio";

export default function GameSectionFinal() {
  const [canGoNextWord1, setCanGoNext1] = useState(false);
  const [canGoNextWord2, setCanGoNext2] = useState(false);
  const [canGoNextWord3, setCanGoNext3] = useState(false);
  const [canGoNext, setCanGoNext] = useState(false);
  const [selectedWordKey, setSelectedWordKey] = useState<WordKey | null>(null);
  const selectedWordKeyRef = useRef<WordKey | null>(null);
  const [audioRunning, setAudioRunning] = useAudioRunning();
  const [showText] = useShowText();
  const { isRecording, toggleRecording } = useRecorder(handleResult);
  const { redirect } = useSectionRedirect();
  const navigate = useNavigate();

  const currentWordsSet = Words[currentPhaseIndex - 1];
  const word1 = currentWordsSet.word1;
  const word2 = currentWordsSet.word2;
  const word3 = currentWordsSet.word3;

  const setRecordingTarget = (key: WordKey) => {
    selectedWordKeyRef.current = key;
    setSelectedWordKey(key);
  };

  async function handleResult(audioBlob: Blob) {
    try {
      const transcript = await sendRecording(audioBlob);
      const currentSelectedKey = selectedWordKeyRef.current;
      const currentSelectedWord = currentSelectedKey
        ? currentWordsSet[currentSelectedKey]
        : null;

      console.info(
        "Transcrição recebida pelo Vosk:",
        transcript,
        "| Palavra esperada:",
        currentSelectedWord?.word ?? "(não selecionada)"
      );

      if (!currentSelectedKey || !currentSelectedWord) {
        console.warn("Nenhuma palavra selecionada para validação.");
        return;
      }

      const isMatch = matchesExpectedSpeech(
        transcript,
        currentSelectedWord.word,
        currentSelectedWord.pronunciations
      );

      if (isMatch) {
        const updatedWord1 = currentSelectedKey === "word1" ? true : canGoNextWord1;
        const updatedWord2 = currentSelectedKey === "word2" ? true : canGoNextWord2;
        const updatedWord3 = currentSelectedKey === "word3" ? true : canGoNextWord3;

        setCanGoNext1(updatedWord1);
        setCanGoNext2(updatedWord2);
        setCanGoNext3(updatedWord3);
        setCanGoNext(updatedWord1 && updatedWord2 && updatedWord3);
        playAudio("resposta_correta", setAudioRunning);
      } else {
        playAudio("resposta_errada", setAudioRunning);
        incrementTotalErrors();
        setCanGoNext(canGoNextWord1 && canGoNextWord2 && canGoNextWord3);
      }
    } catch (error) {
      console.error("Falha ao processar áudio:", error);
      if (error instanceof Error) {
        const friendlyMessage = error.message?.trim()
          ? error.message
          : "Não foi possível processar o áudio. Tente novamente.";
        alert(friendlyMessage);
      }
    }
  }

  useEffect(() => {
    setCanGoNext(false);
  }, [word1.word, word2.word, word3.word]);

  useOneShotAudio(!showText, "repita_palavra_mostrada", setAudioRunning);

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
                onClick={() => {
                  if (audioRunning) {
                    return;
                  }
                  playAudio(`palavra_${word1.word}`, setAudioRunning, true);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (audioRunning) {
                    return;
                  }
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    playAudio(`palavra_${word1.word}`, setAudioRunning, true);
                  }
                }}
              >
                {word1.word}
              </label>
              <button
                type="button"
                id="startRecordingWord1"
                className={styles.recordButton}
                onClick={() => {
                  setRecordingTarget("word1");
                  toggleRecording();
                }}
                disabled={
                  canGoNextWord1 ||
                  (isRecording && selectedWordKey !== "word1") ||
                  audioRunning
                }
              >
                {isRecording && selectedWordKey === "word1" ? "⏹️ Parar" : "🎙️ Gravar"}
              </button>
            </div>

            {/* Bloco 2 */}
            <div className={styles.wordBlock}>
              <label
                className={styles.wordLabel}
                onClick={() => {
                  if (audioRunning) {
                    return;
                  }
                  playAudio(`palavra_${word2.word}`, setAudioRunning, true);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (audioRunning) {
                    return;
                  }
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    playAudio(`palavra_${word2.word}`, setAudioRunning, true);
                  }
                }}
              >
                {word2.word}
              </label>
              <button
                type="button"
                id="startRecordingWord2"
                className={styles.recordButton}
                onClick={() => {
                  setRecordingTarget("word2");
                  toggleRecording();
                }}
                disabled={
                  canGoNextWord2 ||
                  (isRecording && selectedWordKey !== "word2") ||
                  audioRunning
                }
              >
                {isRecording && selectedWordKey === "word2" ? "⏹️ Parar" : "🎙️ Gravar"}
              </button>
            </div>

            {/* Bloco 3 */}
            <div className={styles.wordBlock}>
              <label
                className={styles.wordLabel}
                onClick={() => {
                  if (audioRunning) {
                    return;
                  }
                  playAudio(`palavra_${word3.word}`, setAudioRunning, true);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (audioRunning) {
                    return;
                  }
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    playAudio(`palavra_${word3.word}`, setAudioRunning, true);
                  }
                }}
              >
                {word3.word}
              </label>
              <button
                type="button"
                id="startRecordingWord3"
                className={styles.recordButton}
                onClick={() => {
                  setRecordingTarget("word3");
                  toggleRecording();
                }}
                disabled={
                  canGoNextWord3 ||
                  (isRecording && selectedWordKey !== "word3") ||
                  audioRunning
                }
              >
                {isRecording && selectedWordKey === "word3" ? "⏹️ Parar" : "🎙️ Gravar"}
              </button>
            </div>
          </div>

          <button
            type="button"
            className={styles.nextButton}
            disabled={!canGoNext || audioRunning}
            onClick={() => redirect("GameSectionFinal")}
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

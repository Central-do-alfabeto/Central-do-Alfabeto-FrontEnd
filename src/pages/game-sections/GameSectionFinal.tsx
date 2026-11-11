import useSpeechCapture from "../../hooks/useSpeechCapture";
import RecordControl from "../../components/RecordControl";
import Feedback, { type FeedbackKind } from "../../components/Feedback";
import { getWordSetForPhase, type WordKey, type WordSet } from "../../store/gameConstants";
import { currentPhaseIndex, incrementTotalErrors } from "../../store/gameState";
import { useState, useEffect, useRef } from "react";
import { playAudio } from "../../utils/playAudio";
import { matchesWord } from "../../utils/speechUtils";
import { Navigate, useNavigate } from "react-router-dom";
import { useAudioRunning } from "../../state/useAudioRunning";
import { useShowText } from "../../state/useShowText";
import useSectionRedirect from "../../hooks/useSectionRedirect";
import styles from "../../assets/styles/css/game-section-final.module.css";
import useOneShotAudio from "../../hooks/useOneShotAudio";

export default function GameSectionFinal() {
  const wordSet = getWordSetForPhase(currentPhaseIndex);

  // Sem conjunto de palavras para a fase atual: volta ao menu em vez de quebrar a tela.
  if (!wordSet) {
    return <Navigate to="/PlayerMenu" replace />;
  }

  return <GameSectionFinalContent currentWordsSet={wordSet} />;
}

function GameSectionFinalContent({ currentWordsSet }: { currentWordsSet: WordSet }) {
  const [canGoNextWord1, setCanGoNext1] = useState(false);
  const [canGoNextWord2, setCanGoNext2] = useState(false);
  const [canGoNextWord3, setCanGoNext3] = useState(false);
  const [canGoNext, setCanGoNext] = useState(false);
  const [selectedWordKey, setSelectedWordKey] = useState<WordKey | null>(null);
  const selectedWordKeyRef = useRef<WordKey | null>(null);
  const [audioRunning, setAudioRunning] = useAudioRunning();
  const [showText] = useShowText();
  const [feedback, setFeedback] = useState<FeedbackKind>(null);
  const capture = useSpeechCapture(handleAlternatives);
  const { redirect } = useSectionRedirect();
  const navigate = useNavigate();

  const word1 = currentWordsSet.word1;
  const word2 = currentWordsSet.word2;
  const word3 = currentWordsSet.word3;

  const setRecordingTarget = (key: WordKey) => {
    selectedWordKeyRef.current = key;
    setSelectedWordKey(key);
  };

  function applyResult(key: WordKey, isMatch: boolean) {
    if (isMatch) {
      const updated1 = key === "word1" ? true : canGoNextWord1;
      const updated2 = key === "word2" ? true : canGoNextWord2;
      const updated3 = key === "word3" ? true : canGoNextWord3;

      setCanGoNext1(updated1);
      setCanGoNext2(updated2);
      setCanGoNext3(updated3);
      setCanGoNext(updated1 && updated2 && updated3);
      setFeedback("correct");
      playAudio("resposta_correta", setAudioRunning);
    } else {
      incrementTotalErrors();
      setFeedback("wrong");
      playAudio("resposta_errada", setAudioRunning);
    }
  }

  function handleAlternatives(alternatives: string[]) {
    const key = selectedWordKeyRef.current;
    if (!key) return;
    const target = currentWordsSet[key];
    applyResult(
      key,
      alternatives.some((text) => matchesWord(text, target.word, target.pronunciations))
    );
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
                aria-label={`Palavra ${word1.word}. Ouvir a pronúncia`}
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
              <RecordControl
                capture={capture}
                className={styles.recordButton}
                active={selectedWordKey === "word1"}
                targetLabel={`palavra ${word1.word}`}
                onToggle={() => {
                  setRecordingTarget("word1");
                  capture.toggle();
                }}
                disabled={canGoNextWord1 || audioRunning}
                onAssistedCorrect={() => applyResult("word1", true)}
                onAssistedRetry={() => setFeedback(null)}
              />
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
                aria-label={`Palavra ${word2.word}. Ouvir a pronúncia`}
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
              <RecordControl
                capture={capture}
                className={styles.recordButton}
                active={selectedWordKey === "word2"}
                targetLabel={`palavra ${word2.word}`}
                onToggle={() => {
                  setRecordingTarget("word2");
                  capture.toggle();
                }}
                disabled={canGoNextWord2 || audioRunning}
                onAssistedCorrect={() => applyResult("word2", true)}
                onAssistedRetry={() => setFeedback(null)}
              />
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
                aria-label={`Palavra ${word3.word}. Ouvir a pronúncia`}
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
              <RecordControl
                capture={capture}
                className={styles.recordButton}
                active={selectedWordKey === "word3"}
                targetLabel={`palavra ${word3.word}`}
                onToggle={() => {
                  setRecordingTarget("word3");
                  capture.toggle();
                }}
                disabled={canGoNextWord3 || audioRunning}
                onAssistedCorrect={() => applyResult("word3", true)}
                onAssistedRetry={() => setFeedback(null)}
              />
            </div>
          </div>

          <Feedback kind={feedback} />

          <button aria-label="Ir para a próxima fase"
            type="button"
            className={styles.nextButton}
            disabled={!canGoNext || audioRunning}
            onClick={() => redirect("GameSectionFinal")}
          >
            <span aria-hidden="true">➡️</span>
            {showText && <span> Próxima fase</span>}
          </button>

          <button aria-label="Voltar ao menu"
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

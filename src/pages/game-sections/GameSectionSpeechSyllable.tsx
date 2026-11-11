import { Letters } from "../../store/gameConstants";
import { currentPhaseIndex, incrementTotalErrors } from "../../store/gameState";
import { playAudio } from "../../utils/playAudio";
import { useState, useEffect, useMemo, useRef } from "react";
import useSpeechCapture from "../../hooks/useSpeechCapture";
import RecordControl from "../../components/RecordControl";
import Feedback, { type FeedbackKind } from "../../components/Feedback";
import { useNavigate } from "react-router-dom";
import { useAudioRunning } from "../../state/useAudioRunning";
import { useShowText } from "../../state/useShowText";
import useSectionRedirect from "../../hooks/useSectionRedirect";
import { matchesSyllable } from "../../utils/speechUtils";
import useOneShotAudio from "../../hooks/useOneShotAudio";
import styles from "../../assets/styles/css/game-section-speech-syllable.module.css";

export default function GameSectionSpeechSyllable() {
  const [canGoNextWords, setCanGoNextWords] = useState([false, false, false, false, false]);
  const [canGoNext, setCanGoNext] = useState(false);
  const [clickedWord, setClickedWord] = useState("");
  const clickedWordRef = useRef<string>("");
  const [feedback, setFeedback] = useState<FeedbackKind>(null);
  const capture = useSpeechCapture(handleAlternatives);
  const navigate = useNavigate();
  const [audioRunning, setAudioRunning] = useAudioRunning();
  const [showText] = useShowText();
  const { redirect } = useSectionRedirect();

  const letter = Letters[currentPhaseIndex].letter;
  const syllables = useMemo(
    () => ["a", "e", "i", "o", "u"].map((v) => `${letter}${v}`),
    [letter]
  );
  const firstSyllableAudio = syllables.length > 0 ? `silaba_${syllables[0]}` : null;

  function applyResult(targetSyllable: string, isMatch: boolean) {
    const idx = syllables.indexOf(targetSyllable);
    if (idx !== -1 && isMatch) {
      const updated = [...canGoNextWords];
      updated[idx] = true;
      setCanGoNextWords(updated);
      setCanGoNext(updated.every(Boolean));
      setFeedback("correct");
      playAudio("resposta_correta", setAudioRunning);
      clickedWordRef.current = "";
      setClickedWord("");
    } else {
      incrementTotalErrors();
      setFeedback("wrong");
      playAudio("resposta_errada", setAudioRunning);
    }
  }

  function handleAlternatives(alternatives: string[]) {
    const target = clickedWordRef.current;
    applyResult(target, alternatives.some((text) => matchesSyllable(text, target)));
  }

  useEffect(() => {
    setCanGoNext(false);
    setCanGoNextWords(Array(syllables.length).fill(false));
    clickedWordRef.current = "";
    setClickedWord("");
  }, [syllables]);

  useOneShotAudio(!showText, firstSyllableAudio, setAudioRunning);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          {showText && (
            <p className={styles.helperText}>
              Grave cada sílaba corretamente para continuar! 🎤
            </p>
          )}

          {/* ⬇️ LINHA HORIZONTAL DE BLOCOS (sílaba + botão) */}
          <div className={styles.syllableRow}>
            {syllables.map((syll, idx) => (
              <div className={styles.syllableBlock} key={syll}>
                <div
                  className={styles.syllable}
                  onClick={() => {
                    if (audioRunning) {
                      return;
                    }
                    playAudio(`silaba_${syll}`, setAudioRunning, true);
                  }}
                  role="button"
                  aria-label={`Sílaba ${syll}. Ouvir a pronúncia`}
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      if (audioRunning) {
                        return;
                      }
                      playAudio(`silaba_${syll}`, setAudioRunning, true);
                    }
                  }}
                >
                  {syll}
                </div>

                <RecordControl
                  capture={capture}
                  className={styles.recordButton}
                  active={clickedWord === syll}
                  targetLabel={`sílaba ${syll}`}
                  onToggle={() => {
                    clickedWordRef.current = syll;
                    setClickedWord(syll);
                    capture.toggle();
                  }}
                  disabled={canGoNextWords[idx] || audioRunning}
                  onAssistedCorrect={() => applyResult(syll, true)}
                  onAssistedRetry={() => setFeedback(null)}
                />
              </div>
            ))}
          </div>
          <Feedback kind={feedback} />

          {/* Navegação inferior dentro do container */}
          <button aria-label="Ir para a próxima fase"
            type="button"
            className={styles.nextButton}
            disabled={!canGoNext || audioRunning}
            onClick={() => redirect("GameSectionSpeechSyllable")}
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
            {showText && <span> Retornar</span>}
          </button>
        </form>
      </div>
    </div>
  );
}

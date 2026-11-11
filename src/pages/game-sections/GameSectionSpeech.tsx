import { currentPhaseIndex, incrementTotalErrors } from "../../store/gameState";
import { Letters } from "../../store/gameConstants";
import { useState, useEffect } from "react";
import { playAudio } from "../../utils/playAudio";
import { useNavigate } from "react-router-dom";
import useSpeechCapture from "../../hooks/useSpeechCapture";
import RecordControl from "../../components/RecordControl";
import Feedback, { type FeedbackKind } from "../../components/Feedback";
import { useAudioRunning } from "../../state/useAudioRunning";
import { useShowText } from "../../state/useShowText";
import useSectionRedirect from "../../hooks/useSectionRedirect";
import { matchesLetter } from "../../utils/speechUtils";
import useOneShotAudio from "../../hooks/useOneShotAudio";
import styles from "../../assets/styles/css/game-section-speech.module.css";

export default function GameSectionSpeech() {
  const [canGoNext, setCanGoNext] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackKind>(null);
  const capture = useSpeechCapture(handleAlternatives);
  const navigate = useNavigate();
  const [audioRunning, setAudioRunning] = useAudioRunning();
  const [showText] = useShowText();
  const { redirect } = useSectionRedirect();

  const activeLetter = Letters[currentPhaseIndex];
  const letter = activeLetter.letter;
  const acceptedPronunciations = activeLetter.pronunciations;

  const presentationAudioName = `essa_letra_${letter}_alfabeto`; 

  function applyResult(isMatch: boolean) {
    if (isMatch) {
      setCanGoNext(true);
      setFeedback("correct");
      playAudio("resposta_correta", setAudioRunning);
    } else {
      incrementTotalErrors();
      setCanGoNext(false);
      setFeedback("wrong");
      playAudio("resposta_errada", setAudioRunning);
    }
  }

  function handleAlternatives(alternatives: string[]) {
    applyResult(alternatives.some((text) => matchesLetter(text, letter, acceptedPronunciations)));
  }

  useEffect(() => {
    setCanGoNext(false);
  }, []);

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

        <Feedback kind={feedback} />

        <div className={styles.buttonRow}>
          <div className={styles.recordButtonContainer}>
            <RecordControl
              capture={capture}
              className={styles.recordButton}
              disabled={canGoNext || audioRunning}
              onAssistedCorrect={() => applyResult(true)}
              onAssistedRetry={() => setFeedback(null)}
              targetLabel={`letra ${letter}`}
            />
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

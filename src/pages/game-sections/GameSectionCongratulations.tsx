import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  setCurrentPhaseIndex,
  resetTotalValues,
  currentPhaseIndex,
  setInGameFlow,
  TotalErrors,
  TotalAudioReproductions,
} from "../../store/gameState";
import { useAudioRunning } from "../../state/useAudioRunning";
import { useShowText } from "../../state/useShowText";
import { getProgressService } from "../../services/progress";
import { Letters } from "../../store/gameConstants"; 
import styles from "../../assets/styles/css/game-section-congratulations.module.css";
import useOneShotAudio from "../../hooks/useOneShotAudio";
import { getRouteAfterPhase } from "../../utils/phaseFlow";

export default function GameSectionCongratulations() {
  const [showText] = useShowText();
  const [audioRunning, setAudioRunning] = useAudioRunning();
  const navigate = useNavigate();
  const hasSyncedProgress = useRef(false);
  
  // 1. Captura o índice inicial para evitar reavaliações após o incremento
  const initialPhaseIndexRef = useRef(currentPhaseIndex);
  const completedLetter = useMemo(
    () => Letters[initialPhaseIndexRef.current].letter,
    []
  );

  const congratulationAudioName = useMemo(
    () => `Parabens_aprendeu_${completedLetter}`,
    [completedLetter]
  );

  const completedPhaseIndex = initialPhaseIndexRef.current;
  const errorsSnapshot = TotalErrors;
  const audioSnapshot = TotalAudioReproductions;

  useOneShotAudio(!showText, congratulationAudioName, setAudioRunning);

  const phaseAdvanced = useRef(false);
  const [saveState, setSaveState] = useState<"saving" | "saved" | "error">("saving");

  const saveProgress = useCallback(async () => {
    setSaveState("saving");
    try {
      await getProgressService().saveCompletedPhase({
        currentPhaseIndex: completedPhaseIndex,
        errorsData: errorsSnapshot,
        soundRepeatsData: audioSnapshot,
      });

      if (!phaseAdvanced.current) {
        phaseAdvanced.current = true;
        setCurrentPhaseIndex(1);
        resetTotalValues();
      }
      setSaveState("saved");
    } catch (error) {
      console.error("Falha ao sincronizar progresso do jogador:", error);
      setSaveState("error");
    }
  }, [audioSnapshot, completedPhaseIndex, errorsSnapshot]);

  useEffect(() => {
    if (hasSyncedProgress.current) {
      return;
    }
    hasSyncedProgress.current = true;
    void saveProgress();
  }, [saveProgress]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {showText && (
          <p className={styles.message}>
            Parabéns! Você completou a letra {completedLetter}! 🎉
          </p>
        )}

        <div role="status" aria-live="polite">
          {saveState === "saving" && <p>Salvando seu progresso…</p>}
          {saveState === "saved" && <p>Progresso salvo! ✔</p>}
        </div>
        {saveState === "error" && (
          <div role="alert">
            <p>Não foi possível salvar seu progresso. Verifique a internet e tente de novo.</p>
            <button type="button" className={styles.nextButton} onClick={() => void saveProgress()}>
              <span aria-hidden="true">🔁</span> Tentar salvar de novo
            </button>
          </div>
        )}

        <div className={styles.buttonRow}>
          <button
            type="button"
            className={styles.nextButton}
            onClick={() => navigate(getRouteAfterPhase(completedPhaseIndex))}
            disabled={audioRunning || saveState !== "saved"}
            aria-label="Ir para a próxima fase"
          >
            <span aria-hidden="true">➡️</span>
            {showText && <span> Próxima fase</span>}
          </button>

          <button aria-label="Voltar ao menu"
            type="button"
            className={styles.returnButton}
            onClick={() => {
              setInGameFlow(false);
              navigate("/PlayerMenu");
            }}
            disabled={audioRunning}
          >
            <span aria-hidden="true">⬅️</span>
            {showText && <span> Voltar ao menu</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

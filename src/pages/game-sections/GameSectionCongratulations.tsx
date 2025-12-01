import { useEffect, useMemo, useRef } from "react";
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
import { playerDataUpdate } from "../../services/api/playerDataUpdate";
import { Letters } from "../../store/gameConstants"; 
import styles from "../../assets/styles/css/game-section-congratulations.module.css";
import useOneShotAudio from "../../hooks/useOneShotAudio";

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

  useEffect(() => {
    if (hasSyncedProgress.current) {
      return;
    }
    hasSyncedProgress.current = true;

    const syncProgress = async () => {
      let phaseIncrementApplied = false;

      try {
        await playerDataUpdate({
          currentPhaseIndex: completedPhaseIndex,
          errorsData: errorsSnapshot,
          soundRepeatsData: audioSnapshot,
        });

        setCurrentPhaseIndex(1);
        phaseIncrementApplied = true;
        resetTotalValues();
      } catch (error) {
        console.error("Falha ao sincronizar progresso do jogador:", error);
        if (phaseIncrementApplied) {
          setCurrentPhaseIndex(-1);
        }
      }
    };

    void syncProgress();
  }, [audioSnapshot, completedPhaseIndex, errorsSnapshot]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {showText && (
          <p className={styles.message}>
            Parabéns! Você completou a letra {completedLetter}! 🎉
          </p>
        )}

        <div className={styles.buttonRow}>
          <button
            type="button"
            className={styles.nextButton}
            onClick={() => navigate("/GameSectionPresentation")}
            disabled={audioRunning}
          >
            <span aria-hidden="true">➡️</span>
            {showText && <span> Próxima fase</span>}
          </button>

          <button
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

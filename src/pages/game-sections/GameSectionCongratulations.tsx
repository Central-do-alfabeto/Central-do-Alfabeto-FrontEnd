import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { currentPhaseIndex, resetTotalValues, setInGameFlow, syncCurrentPhaseIndex } from "../../store/gameState";
import { useAudioRunning } from "../../state/useAudioRunning";
import { useShowText } from "../../state/useShowText";
import { getProgressService } from "../../services/progress";
import { Letters } from "../../store/gameConstants";
import { markPhaseCompletionSaved, readPhaseCompletion, type PhaseCompletion } from "../../store/phaseCompletion";
import styles from "../../assets/styles/css/game-section-congratulations.module.css";
import useOneShotAudio from "../../hooks/useOneShotAudio";
import { getRouteAfterPhase } from "../../utils/phaseFlow";

export default function GameSectionCongratulations() {
  // A fase concluída vem do registro feito ao terminar a última atividade. Sem registro
  // (URL aberta direto), não há o que salvar: volta ao menu sem conceder progresso.
  const [completion] = useState(readPhaseCompletion);

  if (!completion || !Letters[completion.phase]) {
    return <Navigate to="/PlayerMenu" replace />;
  }

  return <CongratulationsContent completion={completion} />;
}

function CongratulationsContent({ completion }: { completion: PhaseCompletion }) {
  const [showText] = useShowText();
  const [audioRunning, setAudioRunning] = useAudioRunning();
  const navigate = useNavigate();
  const hasSyncedProgress = useRef(false);

  const completedPhaseIndex = completion.phase;
  const completedLetter = useMemo(() => Letters[completedPhaseIndex].letter, [completedPhaseIndex]);
  const congratulationAudioName = `Parabens_aprendeu_${completedLetter}`;

  useOneShotAudio(!showText, congratulationAudioName, setAudioRunning);

  const [saveState, setSaveState] = useState<"saving" | "saved" | "error">(
    completion.saved ? "saved" : "saving"
  );

  const saveProgress = useCallback(async () => {
    setSaveState("saving");
    try {
      await getProgressService().saveCompletedPhase({
        currentPhaseIndex: completion.phase,
        errorsData: completion.errors,
        soundRepeatsData: completion.audioReproductions,
      });

      // Idempotente: o índice é definido de forma absoluta e nunca retrocede.
      if (currentPhaseIndex < completion.phase + 1) {
        syncCurrentPhaseIndex(completion.phase + 1);
      }
      resetTotalValues();
      markPhaseCompletionSaved();
      setSaveState("saved");
    } catch (error) {
      console.error("Falha ao sincronizar progresso do jogador:", error);
      setSaveState("error");
    }
  }, [completion]);

  useEffect(() => {
    // Ao recarregar depois de salvo, só mostra o sucesso: nada é salvo nem avançado de novo.
    if (completion.saved || hasSyncedProgress.current) {
      return;
    }
    hasSyncedProgress.current = true;
    void saveProgress();
  }, [completion.saved, saveProgress]);

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

import { useState } from "react";
import { resetLocalProgress } from "../services/progress/localProgress";
import { resetTotalValues, setInGameFlow, syncCurrentPhaseIndex } from "../store/gameState";
import styles from "../assets/styles/css/restart.module.css";

/** Modo demonstração: apaga o progresso deste aparelho depois de uma confirmação na tela. */
export default function RestartProgress({ onRestarted }: { onRestarted?: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  const restart = () => {
    resetLocalProgress();
    syncCurrentPhaseIndex(0);
    resetTotalValues();
    setInGameFlow(false);
    sessionStorage.removeItem("homeAudioPlayed");
    setConfirming(false);
    setDone(true);
    onRestarted?.();
  };

  return (
    <div className={styles.wrapper}>
      {!confirming && (
        <button
          type="button"
          className={styles.restartButton}
          onClick={() => {
            setDone(false);
            setConfirming(true);
          }}
        >
          <span aria-hidden="true">🔄</span> Recomeçar do início
        </button>
      )}

      {confirming && (
        <div className={styles.confirm} role="alertdialog" aria-labelledby="restart-title" aria-describedby="restart-text">
          <p id="restart-title" className={styles.title}>
            Recomeçar do início?
          </p>
          <p id="restart-text">Todo o progresso salvo neste aparelho será apagado.</p>
          <div className={styles.actions}>
            <button type="button" className={styles.danger} onClick={restart} autoFocus>
              Sim, recomeçar
            </button>
            <button type="button" className={styles.cancel} onClick={() => setConfirming(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <p role="status" aria-live="polite" className={styles.status}>
        {done ? "Pronto! O jogo voltou para a letra A." : ""}
      </p>
    </div>
  );
}

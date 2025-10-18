import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usePageColor } from "../../state/usePageColor";
import { paletasDisponiveis, type PaletaDisponivel } from "../../store/paletaCores";
import { useShowText } from "../../state/useShowText";
import styles from "../../assets/styles/css/gameConfig.module.css";
import { clearAuthSession } from "../../store/auth";
import { resetTotalValues, setPlayerID, syncCurrentPhaseIndex } from "../../store/gameState";

export default function Config() {
  const [paleta, setPaleta] = usePageColor();
  const [showText, setShowText] = useShowText();
  const navigate = useNavigate();

  const paletaSelecionada = useMemo<PaletaDisponivel>(
    () =>
      (Object.keys(paletasDisponiveis) as PaletaDisponivel[]).find(
        (key) => paletasDisponiveis[key] === paleta
      ) ?? "azul",
    [paleta]
  );

  const handleLogout = () => {
    clearAuthSession();
    setPlayerID(0);
    syncCurrentPhaseIndex(0);
    resetTotalValues();
    sessionStorage.removeItem("homeAudioPlayed");
    navigate("/");
  };

  const handleGoBack = () => {
    navigate("/PlayerMenu");
  };

  return (
    <div className={styles.page}>
      <div className={styles.centralContainer}>
        <div className={styles.configContainer}>
          <h1>⚙️ Configurações</h1>

          <div className={styles.configItem}>
            <label htmlFor="paleta-select">Paleta das telas:</label>
            <select
              id="paleta-select"
              value={paletaSelecionada}
              onChange={(e) => setPaleta(e.target.value as PaletaDisponivel)}
            >
              {Object.keys(paletasDisponiveis).map((nome) => (
                <option key={nome} value={nome}>
                  {nome.charAt(0).toUpperCase() + nome.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.configItem}>
            <label>
              <input
                type="checkbox"
                checked={showText}
                onChange={(e) => setShowText(e.target.checked)}
              />
              Exibir texto
            </label>
          </div>

          <div className={styles.configItem}>
            <button onClick={handleGoBack}>Voltar</button>
          </div>

          <div className={styles.configItem}>
            <button className={styles.logoutButton} onClick={handleLogout}>Sair da conta</button>
          </div>
        </div>
      </div>
    </div>
  );
}

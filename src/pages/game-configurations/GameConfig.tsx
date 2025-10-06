import React, { useEffect, useState } from "react";
import styles from "../../assets/styles/css/gameConfig.module.css";

// Tipagem correta
type PaletaCores = "azul" | "verde" | "vermelho" | "amarelo";

// Paleta de cores suaves
const paletasDisponiveis: Record<PaletaCores, string> = {
  azul: "#b3d9ff",     // azul pastel suave
  verde: "#c8e6c9",    // verde pastel suave
  vermelho: "#ffcdd2", // vermelho rosado pastel
  amarelo: "#fff9c4",  // amarelo claro pastel
};

const GameConfig: React.FC = () => {
  const [paleta, setPaleta] = useState<PaletaCores>("azul");

  // Atualiza a cor de fundo da página
  useEffect(() => {
    document.body.style.backgroundColor = paletasDisponiveis[paleta];
  }, [paleta]);

  return (
    <div className={styles.page}>
      <div className={styles.centralContainer}>
        <div className={styles.configContainer}>
          <h1>⚙️ Configurações</h1>

          <div className={styles.configItem}>
            <label htmlFor="paleta-select">Cor da página:</label>
            <select
              id="paleta-select"
              value={paleta}
              onChange={(e) => setPaleta(e.target.value as PaletaCores)}
            >
              {Object.keys(paletasDisponiveis).map((cor) => (
                <option key={cor} value={cor}>
                  {cor}
                </option>
              ))}
            </select>
          </div>

          <button onClick={() => alert(`Cor selecionada: ${paleta}`)}>
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameConfig;

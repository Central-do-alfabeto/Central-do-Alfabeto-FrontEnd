import { useNavigate } from "react-router-dom";
import styles from "../../assets/styles/css/index.module.css";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className={styles.content}>
      <img
        src="src/assets/images/logo-do-site.png"
        alt="Logo do Quebra-Cabeça do Autismo"
        className={styles.logo}
      />

      <h1 className={styles.title}>Bem-vindo!</h1>
      <p className={styles.subtitle}>Este é um lugar feito com carinho para te ajudar!</p>

      <div className={styles.linhaTopo}>
        <button
          className={`${styles.button} ${styles.botaoEstudante}`}
          onClick={() => navigate("/Register", { state: { role: "players" } })}
        >
          📖 Criar conta de estudantes
        </button>

        <button
          className={`${styles.button} ${styles.botaoEducador}`}
          onClick={() => navigate("/Register", { state: { role: "educators" } })}
        >
          🧑‍🏫 Criar conta de educador/responsável
        </button>
      </div>

      <div className={styles.linhaLogin}>
        <button
          className={`${styles.button} ${styles.botaoLogin}`}
          onClick={() => navigate("/Login")}
        >
          🔑 Fazer login
        </button>
      </div>

      {/* Navegação temporária */}
      <div className={styles.linhaLogin}>
        <button
          className={`${styles.button} ${styles.botaoLogin}`}
          onClick={() => navigate("/GameSectionSpeech")}
        >
          Sessão1
        </button>
      </div>
      <div className={styles.linhaLogin}>
        <button
          className={`${styles.button} ${styles.botaoLogin}`}
          onClick={() => navigate("/GameSectionMultipleChoice")}
        >
          Sessão2
        </button>
      </div>
      <div className={styles.linhaLogin}>
        <button
          className={`${styles.button} ${styles.botaoLogin}`}
          onClick={() => navigate("/GameSectionFinal")}
        >
          Sessão3
        </button>
      </div>
      <div className={styles.linhaLogin}>
        <button
          className={`${styles.button} ${styles.botaoLogin}`}
          onClick={() => navigate("/GameSectionSpeechSyllable")}
        >
          Sessão4
        </button>
      </div>
      <div className={styles.linhaLogin}>
        <button
          className={`${styles.button} ${styles.botaoLogin}`}
          onClick={() => navigate("/GameSectionApresentation")}
        >
          Sessão5
        </button>
      </div>
      <div className={styles.linhaLogin}>
        <button
          className={`${styles.button} ${styles.botaoLogin}`}
          onClick={() => navigate("/PlayerMenu")}
        >
          PlayerMenu
        </button>
      </div>
      <div className={styles.linhaLogin}>
        <button
          className={`${styles.button} ${styles.botaoLogin}`}
          onClick={() => navigate("/GameConfig")}
        >
          Config
        </button>
      </div>
    </div>
  );
}

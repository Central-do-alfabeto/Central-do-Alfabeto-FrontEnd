import { useNavigate } from "react-router-dom";
import styles from "../../assets/styles/css/index.module.css";
import logo from "../../assets/images/logo-do-site.png";
import { getAuthSession } from "../../store/auth";
import { setPlayerID, syncCurrentPhaseIndex } from "../../store/gameState";

export default function Index() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        const session = getAuthSession();

        if (session?.role === "STUDENT") {
            setPlayerID(session.userId);

            const storedPhase = session.playerMeta?.currentPhaseIndex;
            const phaseToSync = typeof storedPhase === "number" && !Number.isNaN(storedPhase) ? storedPhase : 0;
            syncCurrentPhaseIndex(phaseToSync);

            navigate("/PlayerMenu");
            return;
        }

        if (session?.role === "EDUCATOR") {
            navigate("/TeacherMenu");
            return;
        }

        navigate("/Login");
    };

    return (
        <div className={styles.content}>
            <img
                src={logo}
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
                    onClick={handleLoginClick}
                >
                    🔑 Fazer login
                </button>
            </div>

            
        </div>
    );
}

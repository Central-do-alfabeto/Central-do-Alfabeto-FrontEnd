import { useLayoutEffect } from "react";
import { playAudio } from "../../utils/playAudio";
import { useNavigate } from "react-router-dom";
import { useAudioRunning } from "../../state/useAudioRunning";
import { currentPhaseIndex } from "../../store/gameState";
import styles from "../../assets/styles/css/menu.module.css";
import soundIcon from "../../assets/images/sound-icon.png";
import settingsIcon from "../../assets/images/settings-icon.png";

export default function PlayerMenu() {
    const navigate = useNavigate();
    const [audioRunning, setAudioRunning] = useAudioRunning();

    useLayoutEffect(() => {
        const hasPlayed = sessionStorage.getItem("homeAudioPlayed") === "true";

        if (!hasPlayed) {
            playAudio("tela_inicial", setAudioRunning);
            sessionStorage.setItem("homeAudioPlayed", "true");
        }
    }, [setAudioRunning]);

    return (
        <div className={styles.pageBackground}>
            <div className={styles.container}>
                    <div className={styles.menuIcons}>
                        <button
                            className={styles.menuButton}
                            onClick={() => playAudio("tela_inicial", setAudioRunning, true)}
                            disabled={audioRunning}
                        >
                            <img
                                src={soundIcon}
                                alt="Reproduzir áudio do menu"
                                loading="lazy"
                                decoding="async"
                            />
                        </button>
                        <button
                            className={styles.menuButton}
                            onClick={() => navigate("/GameConfig")}
                            disabled={audioRunning}
                        >
                            <img
                                src={settingsIcon}
                                alt="Abrir configurações"
                                loading="lazy"
                                decoding="async"
                            />
                        </button>
                    </div>

                <div className={styles.startButton}>
                    <button
                        onClick={() => {
                            if (currentPhaseIndex === 0) {
                                navigate("/FirstPresentationSection");
                            } else {
                                navigate("/GameSectionPresentation");
                            }
                        }}
                        disabled={audioRunning}
                    >
                        INICIAR
                    </button>
                </div>
            </div>
        </div>
    );
}

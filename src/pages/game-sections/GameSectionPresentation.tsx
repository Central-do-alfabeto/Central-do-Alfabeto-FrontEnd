import { Letters } from "../../store/gameConstants";
import { currentPhaseIndex } from "../../store/gameState";
import { useNavigate } from "react-router-dom";
import { playAudio } from "../../utils/playAudio";
import { useEffect } from "react";
import { useShowText } from "../../state/useShowText";
import { useAudioRunning } from "../../state/useAudioRunning";
import useSectionRedirect from "../../hooks/useSectionRedirect";
import styles from "../../assets/styles/css/game-section-presentation.module.css";

export default function GameSectionPresentation() {
    const navigate = useNavigate();
    const [showText] = useShowText();
    const [audioRunning, setAudioRunning] = useAudioRunning();
    const { redirect } = useSectionRedirect();

    // 1. Definição da letra e construção do nome do áudio
    const letter = Letters[currentPhaseIndex];
    const presentationAudioName = `essa_letra_${letter}_alfabeto`;

    useEffect(() => {
        if (showText) return;
        
        // 2. Toca o áudio de apresentação/introdução da letra
        playAudio(presentationAudioName, setAudioRunning);
        
    }, [showText, setAudioRunning, presentationAudioName]);

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {showText && (
                    <section className={styles.helperText}>
                        Esta é a letra {letter}. Clique na letra para saber sua pronúncia!
                    </section>
                )}

                <section
                    className={styles.letterDisplay}
                    onClick={() =>
                        playAudio(
                            presentationAudioName,
                            setAudioRunning,
                            true
                        )
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            playAudio(
                                presentationAudioName,
                                setAudioRunning,
                                true
                            );
                        }
                    }}
                >
                    {letter}
                </section>

                <div className={styles.buttonRow}>
                    <button
                        type="button"
                        className={styles.nextButton}
                        onClick={() => redirect("GameSectionPresentation")}
                        disabled={audioRunning}
                    >
                        <span aria-hidden="true">➡️</span>
                        {showText && <span> Próxima sessão</span>}
                    </button>
                    <button
                        type="button"
                        className={styles.returnButton}
                        onClick={() => navigate("/PlayerMenu")}
                        disabled={audioRunning}
                    >
                        <span aria-hidden="true">⬅️</span>
                        {showText && <span> Voltar ao menu</span>}
                    </button>
                    <button
                        type="button"
                        className={styles.nextButton}
                        onClick={() => redirect("GameSectionPresentation")}
                        disabled={audioRunning}
                    >
                        <span aria-hidden="true">➡️</span>
                        {showText && <span> Próxima sessão</span>}
                    </button>
                </div>
            </div>
        </div>
    );
}

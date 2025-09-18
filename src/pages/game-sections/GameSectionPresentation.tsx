import { Letters } from "../../store/gameConstants";
import { currentPhaseIndex } from "../../store/gameState";
import { useNavigate } from "react-router-dom";
import { playAudio } from "../../utils/playAudio";
import { useEffect } from "react";
import { useShowText } from "../../state/useShowText";
import { useAudioRunning } from "../../state/useAudioRunning";
import useSectionRedirect from "../../hooks/useSectionRedirect";

export default function GameSectionPresentation() {
    const navigate = useNavigate();
    const [showText] = useShowText(); 
    const [audioRunning, setAudioRunning] = useAudioRunning();
    const { redirect } = useSectionRedirect();

    useEffect(() => {
        if (showText) return;
        playAudio("AudioPresentation", setAudioRunning);
    }, [showText, setAudioRunning]);

    return (
        <div>
            {/* Mostra o texto apenas se showText for true */}
            {showText && (
                <section className="textoEscondido">
                    Esta é a letra {Letters[currentPhaseIndex]}. Clique na letra para saber sua pronúncia!
                </section>
            )}

            {/* Letra clicável para pronúncia */}
            <section
                onClick={() =>
                    playAudio(
                        `AuxLetter${Letters[currentPhaseIndex]}`,
                        setAudioRunning,
                        true
                    )
                }
            >
                {Letters[currentPhaseIndex]}
            </section>

            {/* Navegação */}
            <button
                onClick={() => redirect("GameSectionPresentation")}
                disabled={audioRunning}
            >
                {showText && <div>Próxima sessão</div>}
            </button>
            <button onClick={() => navigate("/PlayerMenu")} disabled={audioRunning}>
                {showText && <div>Voltar ao menu</div>}
            </button>
        </div>
    );
}

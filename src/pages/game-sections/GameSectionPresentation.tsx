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

    // 1. Definição da letra e construção do nome do áudio
    const letter = Letters[currentPhaseIndex];
    const presentationAudioName = `essa_letra_${letter}_alfabeto`;

    useEffect(() => {
        if (showText) return;
        
        // 2. Toca o áudio de apresentação/introdução da letra
        playAudio(presentationAudioName, setAudioRunning);
        
    }, [showText, setAudioRunning, presentationAudioName]);

    return (
        <div>
            {/* Mostra o texto apenas se showText for true */}
            {showText && (
                <section className="textoEscondido">
                    Esta é a letra {letter}. Clique na letra para saber sua pronúncia!
                </section>
            )}

            {/* Letra clicável para pronúncia */}
            <section
                onClick={() =>
                    playAudio(
                        presentationAudioName,
                        setAudioRunning,
                        true
                    )
                }
            >
                {letter}
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

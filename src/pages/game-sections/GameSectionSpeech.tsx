import { currentPhaseIndex, incrementTotalErrors } from "../../store/gameState";
import { Letters } from "../../store/gameConstants";
import { useState } from "react";
import { playAudio } from "../../utils/playAudio";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useRecorder from "../../hooks/useRecorder";
import sendRecording from "../../services/api/sendRecording";

export default function GameSectionSpeech() {
    const [canGoNext, setCanGoNext] = useState(false);
    const { isRecording, toggleRecording } = useRecorder(handleResult);
    const navigate = useNavigate();

    // 🔥 callback para tratar o resultado do backend
    async function handleResult(audioBlob: Blob) {
        const result = await sendRecording(audioBlob);

        if (result === Letters[currentPhaseIndex]) {
            setCanGoNext(true); // libera "Próxima fase"
        } else {
            incrementTotalErrors();
            setCanGoNext(false); // mantém bloqueado
            playAudio(`Helper${currentPhaseIndex}`);
        }
    };

    useEffect(() => {
        setCanGoNext(false); 
        playAudio('Section1');
    }, []);

    return (
        <div>
            <div className="letra" onClick={() => { playAudio(`AuxLetter${Letters[currentPhaseIndex]}`, true) }}>{Letters[currentPhaseIndex]}</div>

            {/* Botão Gravar (bloqueia se acertou) */}
            <button
                id="startRecordingLetter"
                onClick={toggleRecording}
                disabled={canGoNext}
            >
                {isRecording ? "⏹️ Parar" : "🎙️ Gravar"}
            </button>

            {/* Botão Próxima fase (desbloqueia apenas se acertou) */}
            <button className="section2" disabled={!canGoNext} onClick={() => navigate('/Section2')}>
                Próxima fase
            </button>
            <button onClick={() => navigate("/PlayerMenu")}>retornar</button>
        </div>
    );

}
import { Letters } from "../../store/gameConstants";
import { currentPhaseIndex, incrementTotalErrors } from "../../store/gameState";
import { playAudio } from "../../utils/playAudio";
import { useState, useEffect } from "react";
import useRecorder from "../../hooks/useRecorder";
import { useNavigate } from "react-router-dom";
import sendRecording from "../../services/api/sendRecording";
import styles from "../../assets/styles/css/game-section-speech-syllable.module.css";

export default function GameSectionSpeechSyllable() {
    const [canGoNextWords, setCanGoNextWords] = useState([false, false, false, false, false]);
    const [canGoNext, setCanGoNext] = useState(false);
    const [clickedWord, setClickedWord] = useState("");
    const { isRecording, toggleRecording } = useRecorder(handleResult);
    const navigate = useNavigate();

    const syllables = ["a", "e", "i", "o", "u"].map(v => `${Letters[currentPhaseIndex]}${v}`);

    async function handleResult(audioBlob: Blob) {
        const result = await sendRecording(audioBlob);
        const idx = syllables.indexOf(clickedWord);
        if (result === clickedWord && idx !== -1) {
            setCanGoNextWords(prev => {
                const updated = [...prev];
                updated[idx] = true;
                return updated;
            });
        } else {
            incrementTotalErrors();
            playAudio(`Helper${currentPhaseIndex}_GameSectionSpeechSyllabe`);
        }

        setCanGoNext(
            syllables.every((_, i) => (i === idx ? true : canGoNextWords[i]))
        );
    }

    useEffect(() => {
        setCanGoNext(false);
        playAudio('SectionSpeechSylable');
    }, []);

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {syllables.map((syll, idx) => (
                    <div key={syll}>
                        <div className={styles.syllable} onClick={() =>{ playAudio(`AuxLetter${syll}`, true) }}>
                            {syll}
                        </div>
                        <button
                            className={styles.recordButton}
                            onClick={() => { toggleRecording(); setClickedWord(syll); }}
                            disabled={canGoNextWords[idx] || (isRecording && clickedWord !== syll)}
                        >
                            {isRecording && clickedWord === syll ? "⏹️ Parar" : "🎙️ Gravar"}
                        </button>
                    </div>
                ))}

                <button 
                    className={styles.nextButton} 
                    disabled={!canGoNext} 
                    onClick={() => navigate('/Section4')}
                >
                    Próxima fase
                </button>

                <button 
                    className={styles.returnButton} 
                    onClick={() => navigate("/PlayerMenu")}
                >
                    Voltar ao menu
                </button>
            </div>
        </div>
    );
}

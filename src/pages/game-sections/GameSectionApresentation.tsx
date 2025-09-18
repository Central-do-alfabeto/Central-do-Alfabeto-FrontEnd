import { Letters } from "../../store/gameConstants";
import { currentPhaseIndex } from "../../store/gameState";
import { useNavigate } from "react-router-dom";
import { playAudio } from "../../utils/playAudio";
import { useEffect } from "react";

export default function GameSectionApresentation() {
    const navigate = useNavigate();

    useEffect(() => {
        playAudio('AudioApresentation');
    }, []);

    return (
        <div>
            <section onClick={() => playAudio(`AuxLetter${Letters[currentPhaseIndex]}`, true)}>{Letters[currentPhaseIndex]}</section>
            <button onClick={() => navigate("/Section1")}></button>
            <button onClick={() => navigate("/PlayerMenu")}>retornar</button>
        </div>
    );
}
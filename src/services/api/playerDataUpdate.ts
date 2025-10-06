import axios from "axios";
import { currentPhaseIndex, TotalAudioReproductions, TotalErrors, PlayerID } from "../../store/gameState";

export function playerDataUpdate() {
    try {
        const response = axios.put(`${import.meta.env.VITE_API_URL}/player/${PlayerID}/updateProgress`, {
            currentPhaseIndex,
            TotalAudioReproductions,
            TotalErrors,
            PlayerID
        });

        console.log(response);
    } catch(e: any) {
        console.log(e);
    }
}
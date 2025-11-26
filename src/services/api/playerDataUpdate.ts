import apiClient from "./apiClient";
import { currentPhaseIndex, TotalAudioReproductions, TotalErrors, PlayerID } from "../../store/gameState";

export async function playerDataUpdate() {
    if (!PlayerID) {
        console.warn("PlayerID ausente ao tentar atualizar progresso");
        return;
    }

    try {
        await apiClient.put(`/players/${PlayerID}/updateProgress`, {
            currentPhaseIndex,
            numberOfErrors: TotalErrors,
            numberOfSoundRepeats: TotalAudioReproductions,
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Erro em playerDataUpdate:", error.message);
        } else {
            console.error("Erro não esperado:", error);
        }
        throw error;
    }
}
import apiClient from "./apiClient";
import {
    currentPhaseIndex,
    TotalAudioReproductions,
    TotalErrors,
    PlayerID,
} from "../../store/gameState";

export type PlayerProgressPayload = {
    currentPhaseIndex: number;
    errorsData: number;
    soundRepeatsData: number;
};

export async function playerDataUpdate(payload?: PlayerProgressPayload) {
    if (!PlayerID) {
        console.warn("PlayerID ausente ao tentar atualizar progresso");
        return;
    }

    try {
        const payloadToSend: PlayerProgressPayload = payload ?? {
            currentPhaseIndex,
            errorsData: TotalErrors,
            soundRepeatsData: TotalAudioReproductions,
        };

        await apiClient.put(`/players/${PlayerID}/updateProgress`, payloadToSend);
    } catch (error) {
        if (error instanceof Error) {
            console.error("Erro em playerDataUpdate:", error.message);
        } else {
            console.error("Erro não esperado:", error);
        }
        throw error;
    }
}
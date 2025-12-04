import { isAxiosError } from "axios";
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

        await apiClient.post(`/players/${PlayerID}/progress`, payloadToSend);
    } catch (error) {
        if (isAxiosError(error) && error.response?.status === 409) {
            console.warn("Progresso já registrado para esta fase; ignorando novo POST.");
            return;
        }

        if (error instanceof Error) {
            console.error("Erro em playerDataUpdate:", error.message);
        } else {
            console.error("Erro não esperado:", error);
        }
        throw error;
    }
}
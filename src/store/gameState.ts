export let currentPhaseIndex: number = 0;
export let PlayerID: number = 0;

export function setCurrentPhaseIndex(value: number) {
    currentPhaseIndex += value;
}

export function setPlayerID(value: number) {
    PlayerID = value;
}

export const TotalErrors = Array(50).fill(0);

export function incrementTotalErrors() {
    TotalErrors[currentPhaseIndex] += 1;
}  

export const TotalAudioReproductions = Array(50).fill(0);

export function incrementTotalAudioReproductions() {
    TotalAudioReproductions[currentPhaseIndex] += 1;
}
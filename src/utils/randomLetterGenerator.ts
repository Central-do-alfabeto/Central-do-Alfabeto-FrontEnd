import { Letters } from "../store/gameConstants";
import { currentPhaseIndex } from "../store/gameState";

function rand(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomLetter() {
    const index = rand(0, Letters.length - 1);
    return Letters[index];
}

export default function optionsForPhase(total = 4) {
    const correctLeter = Letters[currentPhaseIndex];
    const result = new Set([correctLeter]);
    while (result.size < total) {
    result.add(getRandomLetter());
    }
   
    return [...result].sort(() => Math.random() - 0.5);
}
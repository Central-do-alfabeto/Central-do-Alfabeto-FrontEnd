import { isGameComplete } from "../store/gameConstants";

export const GAME_COMPLETE_ROUTE = "/GameComplete";

/**
 * Sequência de atividades de cada fase:
 * - fase 0 (A): apresentação -> fala -> múltipla escolha -> parabéns
 * - fases 1 a 4 (E, I, O, U): ... -> múltipla escolha -> palavras -> parabéns
 * - demais fases (consoantes): ... -> múltipla escolha -> sílabas -> palavras -> parabéns
 */
export function getNextSectionRoute(phaseIndex: number, currentSection: string): string | null {
  const isFirstLetter = phaseIndex === 0;
  const isVowel = phaseIndex >= 1 && phaseIndex <= 4;

  switch (currentSection) {
    case "GameSectionPresentation":
      return "/GameSectionSpeech";
    case "GameSectionSpeech":
      return "/GameSectionMultipleChoice";
    case "GameSectionMultipleChoice":
      if (isFirstLetter) return "/GameSectionCongratulations";
      return isVowel ? "/GameSectionFinal" : "/GameSectionSpeechSyllable";
    case "GameSectionSpeechSyllable":
      return isFirstLetter || isVowel ? null : "/GameSectionFinal";
    case "GameSectionFinal":
      return isFirstLetter ? null : "/GameSectionCongratulations";
    default:
      return null;
  }
}

/** Rota exibida ao clicar em "próxima fase" depois de concluir a fase indicada. */
export function getRouteAfterPhase(completedPhaseIndex: number): string {
  return isGameComplete(completedPhaseIndex + 1)
    ? GAME_COMPLETE_ROUTE
    : "/GameSectionPresentation";
}

/** Rota aberta pelo botão INICIAR do menu do aluno. */
export function getStartRoute(phaseIndex: number): string {
  if (isGameComplete(phaseIndex)) return GAME_COMPLETE_ROUTE;
  return phaseIndex === 0 ? "/FirstPresentationSection" : "/GameSectionPresentation";
}

import { describe, expect, it } from "vitest";
import { TOTAL_PHASES, getWordSetForPhase } from "../store/gameConstants";
import {
  GAME_COMPLETE_ROUTE,
  getNextSectionRoute,
  getRouteAfterPhase,
  getStartRoute,
} from "./phaseFlow";

/** Percorre as atividades de uma fase, da apresentação até os parabéns. */
function walkPhase(phaseIndex: number): string[] {
  const visited = ["GameSectionPresentation"];
  let section = "GameSectionPresentation";

  for (let guard = 0; guard < 10; guard++) {
    const route = getNextSectionRoute(phaseIndex, section);
    if (!route) break;
    section = route.slice(1);
    visited.push(section);
    if (section === "GameSectionCongratulations") break;
  }

  return visited;
}

describe("progressão das fases", () => {
  it("a letra A não tem sílabas nem palavras", () => {
    expect(walkPhase(0)).toEqual([
      "GameSectionPresentation",
      "GameSectionSpeech",
      "GameSectionMultipleChoice",
      "GameSectionCongratulations",
    ]);
  });

  it("as vogais E, I, O e U passam pelas palavras, sem sílabas", () => {
    for (const phase of [1, 2, 3, 4]) {
      expect(walkPhase(phase)).toEqual([
        "GameSectionPresentation",
        "GameSectionSpeech",
        "GameSectionMultipleChoice",
        "GameSectionFinal",
        "GameSectionCongratulations",
      ]);
    }
  });

  it("as consoantes passam por sílabas e palavras", () => {
    for (let phase = 5; phase < TOTAL_PHASES; phase++) {
      expect(walkPhase(phase)).toEqual([
        "GameSectionPresentation",
        "GameSectionSpeech",
        "GameSectionMultipleChoice",
        "GameSectionSpeechSyllable",
        "GameSectionFinal",
        "GameSectionCongratulations",
      ]);
    }
  });

  it("toda fase que abre a tela de palavras tem palavras (A a Z, incluindo X, Y e Z)", () => {
    for (let phase = 0; phase < TOTAL_PHASES; phase++) {
      if (walkPhase(phase).includes("GameSectionFinal")) {
        const set = getWordSetForPhase(phase);
        expect(set, `fase ${phase}`).toBeDefined();
        expect(set!.word1.word).toBeTruthy();
      }
    }
  });

  it("toda fase de A a Z chega à tela de parabéns", () => {
    for (let phase = 0; phase < TOTAL_PHASES; phase++) {
      expect(walkPhase(phase).at(-1), `fase ${phase}`).toBe("GameSectionCongratulations");
    }
  });

  it("percorrer o jogo de A a Z termina na tela de conclusão", () => {
    let phase = 0;
    let route = getStartRoute(phase);
    expect(route).toBe("/FirstPresentationSection");

    while (route !== GAME_COMPLETE_ROUTE) {
      expect(phase).toBeLessThan(TOTAL_PHASES);
      route = getRouteAfterPhase(phase);
      phase += 1;
    }

    expect(phase).toBe(TOTAL_PHASES);
  });

  it("concluir o Z leva à tela de conclusão e as demais letras à próxima apresentação", () => {
    expect(getRouteAfterPhase(24)).toBe("/GameSectionPresentation");
    expect(getRouteAfterPhase(25)).toBe(GAME_COMPLETE_ROUTE);
  });

  it("o botão INICIAR de quem já terminou abre a tela de conclusão", () => {
    expect(getStartRoute(0)).toBe("/FirstPresentationSection");
    expect(getStartRoute(10)).toBe("/GameSectionPresentation");
    expect(getStartRoute(25)).toBe("/GameSectionPresentation");
    expect(getStartRoute(26)).toBe(GAME_COMPLETE_ROUTE);
  });

  it("seções desconhecidas não avançam", () => {
    expect(getNextSectionRoute(5, "Inexistente")).toBeNull();
  });
});

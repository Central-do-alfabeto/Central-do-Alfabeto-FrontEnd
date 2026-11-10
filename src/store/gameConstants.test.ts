import { describe, expect, it } from "vitest";
import {
  Letters,
  TOTAL_PHASES,
  WordsByLetter,
  getWordSetForPhase,
  isGameComplete,
} from "./gameConstants";

const ALPHABET_ORDER = "AEIOUBCDFGHJKLMNPQRSTVWXYZ".split("");

describe("conteúdo do jogo", () => {
  it("tem uma fase para cada uma das 26 letras", () => {
    expect(TOTAL_PHASES).toBe(26);
    expect(Letters.map((l) => l.letter)).toEqual(ALPHABET_ORDER);
  });

  it("tem conjunto de palavras para toda letra de A a Z", () => {
    expect(Object.keys(WordsByLetter).sort()).toEqual([...ALPHABET_ORDER].sort());
  });

  it("cada conjunto tem 3 palavras não vazias e diferentes", () => {
    for (const letter of ALPHABET_ORDER) {
      const set = WordsByLetter[letter];
      const words = [set.word1.word, set.word2.word, set.word3.word];
      expect(words.every((w) => w.trim().length > 0), letter).toBe(true);
      expect(new Set(words.map((w) => w.toLowerCase())).size, letter).toBe(3);
    }
  });

  it("K, W e Y usam palavras que começam com a própria letra", () => {
    for (const letter of ["K", "W", "Y"]) {
      const set = WordsByLetter[letter];
      for (const key of ["word1", "word2", "word3"] as const) {
        expect(set[key].word.toUpperCase().startsWith(letter), `${letter}: ${set[key].word}`).toBe(true);
      }
    }
  });

  it("mantém as palavras alinhadas à letra a partir do K", () => {
    const first = (phaseIndex: number) => getWordSetForPhase(phaseIndex)?.word1.word;
    const phaseOf = (letter: string) => ALPHABET_ORDER.indexOf(letter);

    expect(first(phaseOf("J"))).toBe("Jaca");
    expect(first(phaseOf("K"))).toBe("Kiwi");
    expect(first(phaseOf("L"))).toBe("Lago");
    expect(first(phaseOf("V"))).toBe("Vaca");
    expect(first(phaseOf("W"))).toBe("Wafer");
    expect(first(phaseOf("X"))).toBe("Xale");
    expect(first(phaseOf("Y"))).toBe("Yoga");
    expect(first(phaseOf("Z"))).toBe("Zebra");
  });

  it("não devolve palavras para fases inexistentes", () => {
    expect(getWordSetForPhase(26)).toBeUndefined();
    expect(getWordSetForPhase(-1)).toBeUndefined();
  });

  it("considera o jogo concluído somente depois do Z", () => {
    expect(isGameComplete(25)).toBe(false);
    expect(isGameComplete(26)).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { Letters, WordsByLetter } from "../store/gameConstants";
import {
  editDistance,
  matchesLetter,
  matchesSyllable,
  matchesWord,
  maxEditsForWord,
  normalizeSpeech,
  syllableVariants,
} from "./speechUtils";

const pronunciationsOf = (letter: string) => Letters.find((l) => l.letter === letter)!.pronunciations;
const letterOk = (transcript: string, letter: string) =>
  matchesLetter(transcript, letter, pronunciationsOf(letter));

describe("normalizeSpeech", () => {
  it("remove acentos, pontuação e diferenças de maiúsculas", () => {
    expect(normalizeSpeech("  BÊ!  ")).toBe("be");
    expect(normalizeSpeech("Ação, coração.")).toBe("acao coracao");
    expect(normalizeSpeech("")).toBe("");
  });
});

describe("matchesLetter", () => {
  it("aceita a letra e o nome falado dela", () => {
    expect(letterOk("b", "B")).toBe(true);
    expect(letterOk("Bê", "B")).toBe(true);
    expect(letterOk("BE.", "B")).toBe(true);
    expect(letterOk("jota", "J")).toBe(true);
    expect(letterOk("xis", "X")).toBe(true);
    expect(letterOk("é", "E")).toBe(true);
  });

  it("aceita a frase de apresentação antes da letra", () => {
    expect(letterOk("a letra bê", "B")).toBe(true);
    expect(letterOk("esta é a letra b", "B")).toBe(true);
  });

  it("rejeita falsos positivos que a busca por trecho aprovava", () => {
    expect(letterOk("esta é a letra do alfabeto", "B")).toBe(false);
    expect(letterOk("alfabeto", "B")).toBe(false);
    expect(letterOk("banana", "B")).toBe(false);
    expect(letterOk("bola", "B")).toBe(false);
    expect(letterOk("o gato bebe leite", "B")).toBe(false);
    expect(letterOk("a letra", "B")).toBe(false);
    expect(letterOk("cê", "B")).toBe(false);
  });

  it("rejeita fala que apenas contém a vogal", () => {
    expect(letterOk("a", "A")).toBe(true);
    expect(letterOk("o gato", "A")).toBe(false);
    expect(letterOk("casa", "A")).toBe(false);
    expect(letterOk("e", "A")).toBe(false);
  });

  it("não aceita E no lugar de I", () => {
    expect(letterOk("i", "I")).toBe(true);
    expect(letterOk("e", "I")).toBe(false);
  });

  it("rejeita fala vazia", () => {
    expect(letterOk("", "B")).toBe(false);
    expect(letterOk("   ", "B")).toBe(false);
  });
});

describe("matchesSyllable", () => {
  it("aceita a sílaba falada, com ou sem apresentação", () => {
    expect(matchesSyllable("ba", "Ba")).toBe(true);
    expect(matchesSyllable("Bá!", "Ba")).toBe(true);
    expect(matchesSyllable("b a", "Ba")).toBe(true);
    expect(matchesSyllable("sílaba ba", "Ba")).toBe(true);
    expect(matchesSyllable("esta é a sílaba ba", "Ba")).toBe(true);
  });

  it("aceita variantes de grafia do mesmo som", () => {
    expect(matchesSyllable("cha", "Xa")).toBe(true);
    expect(matchesSyllable("ca", "Ka")).toBe(true);
    expect(matchesSyllable("qui", "Ki")).toBe(true);
    expect(matchesSyllable("a", "Ha")).toBe(true);
    expect(syllableVariants("Xe")).toEqual(["xe", "che"]);
  });

  it("rejeita falsos positivos", () => {
    expect(matchesSyllable("bola", "Ba")).toBe(false);
    expect(matchesSyllable("banana", "Ba")).toBe(false);
    expect(matchesSyllable("mal", "Ma")).toBe(false);
    expect(matchesSyllable("be", "Ba")).toBe(false);
    expect(matchesSyllable("sílaba", "Ba")).toBe(false);
    expect(matchesSyllable("a", "Ba")).toBe(false);
    expect(matchesSyllable("", "Ba")).toBe(false);
  });
});

describe("matchesWord", () => {
  it("aceita a palavra, com ou sem apresentação", () => {
    expect(matchesWord("casa", "Casa")).toBe(true);
    expect(matchesWord("CASA.", "Casa")).toBe(true);
    expect(matchesWord("a palavra casa", "Casa")).toBe(true);
    expect(matchesWord("xa drez", "Xadrez")).toBe(true);
  });

  it("aceita pronúncias alternativas cadastradas", () => {
    const { word, pronunciations } = WordsByLetter.O.word2;
    expect(matchesWord("e o", word, pronunciations)).toBe(true);
    expect(matchesWord("e ou", word, pronunciations)).toBe(true);
    expect(matchesWord("kiwi", "Kiwi", ["quivi"])).toBe(true);
    expect(matchesWord("quivi", "Kiwi", ["quivi"])).toBe(true);
  });

  it("tolera uma letra diferente em palavras de 5 a 8 letras", () => {
    expect(matchesWord("xadres", "Xadrez")).toBe(true);
    expect(matchesWord("goiava", "Goiaba")).toBe(true);
  });

  it("não tolera diferenças em palavras curtas", () => {
    expect(matchesWord("boa", "Bola")).toBe(false);
    expect(matchesWord("baba", "Boba")).toBe(false);
    expect(matchesWord("casas", "Casa")).toBe(false);
    expect(matchesWord("sapo", "Sapa")).toBe(false);
  });

  it("rejeita falsos positivos", () => {
    expect(matchesWord("zebra", "Xadrez")).toBe(false);
    expect(matchesWord("esta obra sapo", "Sapo")).toBe(false);
    expect(matchesWord("a palavra", "Casa")).toBe(false);
    expect(matchesWord("a casa é bonita", "Casa")).toBe(false);
    expect(matchesWord("", "Casa")).toBe(false);
    expect(matchesWord("goiabada", "Goiaba")).toBe(false);
  });
});

describe("tolerância", () => {
  it("calcula a distância de edição", () => {
    expect(editDistance("casa", "casa")).toBe(0);
    expect(editDistance("casa", "cama")).toBe(1);
    expect(editDistance("xadrez", "xadres")).toBe(1);
    expect(editDistance("", "abc")).toBe(3);
    expect(editDistance("kitten", "sitting")).toBe(3);
  });

  it("limita o número de erros pelo tamanho da palavra", () => {
    expect(maxEditsForWord(3)).toBe(0);
    expect(maxEditsForWord(4)).toBe(0);
    expect(maxEditsForWord(5)).toBe(1);
    expect(maxEditsForWord(8)).toBe(1);
    expect(maxEditsForWord(9)).toBe(2);
  });
});

/**
 * Validação da fala da criança.
 *
 * A transcrição é normalizada (minúsculas, sem acentos nem pontuação) e comparada com
 * o alvo da atividade. Não existe busca por trecho: a fala inteira, depois de retirada
 * uma frase de apresentação opcional ("a letra ...", "a palavra ..."), precisa ser igual
 * ao alvo ou a uma de suas formas aceitas.
 *
 * Regras por tipo de alvo:
 * - Letra: aceita a própria letra ("b") ou o nome falado dela ("bê", "be"), conforme a
 *   lista de pronúncias da letra. Nenhuma tolerância a erros de grafia: o reconhecedor
 *   erra muito em itens curtos e uma letra parecida com outra seria aprovada.
 * - Sílaba: aceita a sílaba ("ba"), com a grafia separada pelo reconhecedor ("b a") ou
 *   com variantes de grafia do mesmo som (ver `syllableVariants`). Sem tolerância.
 * - Palavra: aceita a palavra, suas pronúncias alternativas cadastradas e, para palavras
 *   longas, pequenas diferenças (ver `maxEditsForWord`).
 */

const CARRIER_KEYWORDS = new Set(["letra", "palavra", "silaba", "silabas"]);
const CARRIER_PREFIX_WORDS = new Set(["a", "o", "e", "eh", "um", "uma", "esta", "essa", "este", "esse"]);

/** Minúsculas, sem acentos, sem pontuação e com espaços simples. */
export function normalizeSpeech(text: string): string {
  return (text ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Remove uma frase de apresentação no começo da fala, como "esta é a letra" ou
 * "a palavra". Só é removida quando termina em "letra", "palavra" ou "sílaba(s)" e
 * contém apenas artigos/demonstrativos antes disso.
 */
function stripCarrierPhrase(tokens: string[]): string[] {
  const keywordIndex = tokens.findIndex((token) => CARRIER_KEYWORDS.has(token));
  if (keywordIndex === -1) {
    return tokens;
  }

  const prefix = tokens.slice(0, keywordIndex);
  if (!prefix.every((token) => CARRIER_PREFIX_WORDS.has(token))) {
    return tokens;
  }

  return tokens.slice(keywordIndex + 1);
}

/** Distância de edição (Levenshtein) entre duas palavras já normalizadas. */
export function editDistance(a: string, b: string): number {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let i = 1; i <= a.length; i++) {
    let diagonal = previous[0];
    previous[0] = i;

    for (let j = 1; j <= b.length; j++) {
      const above = previous[j];
      previous[j] = Math.min(
        previous[j] + 1,
        previous[j - 1] + 1,
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      diagonal = above;
    }
  }

  return previous[b.length];
}

/**
 * Tolerância para palavras: até 4 letras exige igualdade exata (palavras curtas se
 * confundem facilmente entre si, como "boba" e "baba"), de 5 a 8 letras aceita 1 letra
 * diferente e a partir de 9 letras aceita 2.
 */
export function maxEditsForWord(length: number): number {
  if (length <= 4) return 0;
  if (length <= 8) return 1;
  return 2;
}

/** Fala já normalizada, sem a frase de apresentação, como lista de palavras. */
function extractSpokenTokens(transcript: string): string[] {
  const normalized = normalizeSpeech(transcript);
  if (!normalized) return [];
  return stripCarrierPhrase(normalized.split(" "));
}

function matchesAnyForm(tokens: string[], forms: string[], allowedEdits = 0): boolean {
  if (tokens.length === 0) return false;

  const spoken = tokens.join(" ");
  const spokenJoined = tokens.join("");

  return forms.some((form) => {
    const normalizedForm = normalizeSpeech(form);
    if (!normalizedForm) return false;

    if (spoken === normalizedForm || spokenJoined === normalizedForm.replace(/ /g, "")) {
      return true;
    }

    // Tolerância só vale para uma única palavra falada (sem espaços).
    return (
      allowedEdits > 0 &&
      tokens.length === 1 &&
      !normalizedForm.includes(" ") &&
      editDistance(spokenJoined, normalizedForm) <= allowedEdits
    );
  });
}

/** Aceita a letra ("b") ou o nome falado dela ("bê"), conforme `spokenNames`. */
export function matchesLetter(transcript: string, letter: string, spokenNames: string[] = []): boolean {
  return matchesAnyForm(extractSpokenTokens(transcript), [letter, ...spokenNames]);
}

/**
 * Formas de grafia que representam o mesmo som de uma sílaba, por exemplo "xa" e "cha"
 * ou "ka" e "ca". O "h" é mudo em português, então "ha" soa como "a".
 */
export function syllableVariants(syllable: string): string[] {
  const normalized = normalizeSpeech(syllable).replace(/ /g, "");
  if (normalized.length < 2) return [normalized];

  const onset = normalized.slice(0, -1);
  const vowel = normalized.slice(-1);
  const softVowel = vowel === "e" || vowel === "i";
  const variants = new Set([normalized]);

  switch (onset) {
    case "x":
      variants.add(`ch${vowel}`);
      break;
    case "k":
      variants.add(`${softVowel ? "qu" : "c"}${vowel}`);
      break;
    case "y":
      variants.add(`i${vowel}`);
      break;
    case "w":
      variants.add(`u${vowel}`);
      break;
    case "h":
      variants.add(vowel);
      break;
  }

  return Array.from(variants);
}

export function matchesSyllable(transcript: string, syllable: string): boolean {
  return matchesAnyForm(extractSpokenTokens(transcript), syllableVariants(syllable));
}

/** Aceita a palavra, as pronúncias alternativas cadastradas e pequenas diferenças (palavras longas). */
export function matchesWord(transcript: string, word: string, alternatives: string[] = []): boolean {
  const normalizedWord = normalizeSpeech(word).replace(/ /g, "");
  const edits = maxEditsForWord(normalizedWord.length);

  return (
    matchesAnyForm(extractSpokenTokens(transcript), [word], edits) ||
    matchesAnyForm(extractSpokenTokens(transcript), alternatives)
  );
}

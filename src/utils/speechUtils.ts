import { isAutoSpeechAutoPassEnabled } from "./debugFlags";
function stripAccents(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function normalizeToken(token: string): string {
  return stripAccents(token).toUpperCase();
}

export function tokenizeSpeechText(transcript: string): string[] {
  if (!transcript) {
    return [];
  }

  return stripAccents(transcript)
    .toUpperCase()
    .split(/[^A-Z]+/)
    .filter(Boolean);
}

const LETTER_VARIANTS: Record<string, string[]> = {
  X: ["XIS", "CHIS"],
};

function addPhoneticVariants(baseToken: string): Set<string> {
  const variants = new Set<string>([baseToken]);

  const letterExtras = LETTER_VARIANTS[baseToken];
  if (letterExtras) {
    letterExtras.forEach((variant) => variants.add(variant));
  }

  // sílabas ou palavras iniciadas com X podem ser reconhecidas como CH + vogal
  if (/^X[A-ZÁÉÍÓÚ]/.test(baseToken)) {
    variants.add(baseToken.replace(/^X/, "CH"));
  }

  return variants;
}

function applyPhoneticNormalizations(value: string): string {
  let normalized = value;

  normalized = normalized.replace(/LH/g, "I");
  normalized = normalized.replace(/NH/g, "I");
  normalized = normalized.replace(/CH/g, "X");
  normalized = normalized.replace(/SH/g, "X");
  normalized = normalized.replace(/PH/g, "F");
  normalized = normalized.replace(/QU([EI])/g, "K$1");
  normalized = normalized.replace(/GU([EI])/g, "G$1");
  normalized = normalized.replace(/H/g, "");
  normalized = normalized.replace(/([A-Z])\1+/g, "$1");

  return normalized;
}

function normalizeSentence(value: string): string {
  return stripAccents(value).toUpperCase().replace(/\s+/g, " ").trim();
}

export function matchesExpectedSpeech(
  transcript: string,
  expected: string,
  acceptedPronunciations: string[] = []
): boolean {
  if (isAutoSpeechAutoPassEnabled()) {
    return true;
  }

  const candidates = [expected, ...acceptedPronunciations];
  const normalizedTranscriptSentence = normalizeSentence(transcript);
  const transcriptTokens = tokenizeSpeechText(transcript);
  const tokens = new Set(transcriptTokens);
  const phoneticTokens = new Set(
    transcriptTokens.map((token) => applyPhoneticNormalizations(token))
  );
  const mergedLetters = stripAccents(transcript)
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
  const mergedPhonetic = applyPhoneticNormalizations(mergedLetters);

  for (const candidate of candidates) {
    const normalizedSentence = normalizeSentence(candidate);
    if (normalizedSentence && normalizedTranscriptSentence === normalizedSentence) {
      return true;
    }

    const candidateTokens = tokenizeSpeechText(candidate);
    if (candidateTokens.length === 0) {
      continue;
    }

    const candidateMerged = candidateTokens.join("");

    const allTokensPresent = candidateTokens.every((token) => tokens.has(token));
    if (allTokensPresent) {
      return true;
    }

    const allPhoneticTokensPresent = candidateTokens.every((token) =>
      phoneticTokens.has(applyPhoneticNormalizations(token))
    );
    if (allPhoneticTokensPresent) {
      return true;
    }

    const allVariantsPresent = candidateTokens.every((token) => {
      const variants = addPhoneticVariants(token);
      return (
        Array.from(variants).some((variant) => tokens.has(variant)) ||
        Array.from(variants).some((variant) =>
          phoneticTokens.has(applyPhoneticNormalizations(variant))
        )
      );
    });
    if (allVariantsPresent) {
      return true;
    }

    if (candidateMerged && mergedLetters.includes(candidateMerged)) {
      return true;
    }

    const candidateMergedPhonetic = applyPhoneticNormalizations(candidateMerged);
    if (candidateMergedPhonetic && mergedPhonetic.includes(candidateMergedPhonetic)) {
      return true;
    }
  }

  return false;
}

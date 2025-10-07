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

export function matchesExpectedSpeech(
  transcript: string,
  expected: string
): boolean {
  const expectedToken = normalizeToken(expected);
  if (!expectedToken) {
    return false;
  }

  const tokens = new Set(tokenizeSpeechText(transcript));
  if (tokens.has(expectedToken)) {
    return true;
  }

  const variants = addPhoneticVariants(expectedToken);
  for (const variant of variants) {
    if (tokens.has(variant)) {
      return true;
    }
  }

  return false;
}

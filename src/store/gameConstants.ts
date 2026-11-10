export type LetterPronunciation = {
    letter: string;
    pronunciations: string[];
};

const createLetter = (letter: string, pronunciations: string[] = []): LetterPronunciation => ({
    letter,
    pronunciations,
});

export const Letters: LetterPronunciation[] = [
    createLetter("A", ["Á", "Â", "Ã", "AH"]),
    createLetter("E", ["É", "Ê", "EH"]),
    createLetter("I", ["E", "IH"]),
    createLetter("O", ["Ó", "Ô", "OH"]),
    createLetter("U", ["Ú", "UH"]),
    createLetter("B", ["BÊ", "BE", "BÉ"]),
    createLetter("C", ["CÊ", "CE", "CÉ"]),
    createLetter("D", ["DÊ", "DE", "DÉ"]),
    createLetter("F", ["ÉFE", "EFE"]),
    createLetter("G", ["GÊ", "GE"]),
    createLetter("H", ["AGÁ", "HA", "HÁ"]),
    createLetter("J", ["JOTA"]),
    createLetter("K", ["KÁ", "CÁ"]),
    createLetter("L", ["ELE"]),
    createLetter("M", ["EME"]),
    createLetter("N", ["ENE"]),
    createLetter("P", ["PÊ", "PE", "PÉ"]),
    createLetter("Q", ["QUÊ", "QUE"]),
    createLetter("R", ["ERRE", "ERE"]),
    createLetter("S", ["ESSE", "ECE"]),
    createLetter("T", ["TÊ", "TE", "TÉ"]),
    createLetter("V", ["VÊ", "VE", "VÉ"]),
    createLetter("W", ["DÁBLIO", "DABLIU", "DOUBLE U"]),
    createLetter("X", ["XIS", "CHIS"]),
    createLetter("Y", ["ÍPSILON", "IPSILON", "YPSILON"]),
    createLetter("Z", ["ZÊ", "ZE", "ZÉ"]),
];

export type WordPronunciation = {
    word: string;
    pronunciations: string[];
};

export type WordSet = {
    word1: WordPronunciation;
    word2: WordPronunciation;
    word3: WordPronunciation;
};

export type WordKey = keyof WordSet;

/** Quantidade de fases (uma por letra, de A a Z). Depois da última fase o jogo termina. */
export const TOTAL_PHASES = Letters.length;

/** Indica se o índice de fase já passou da última letra (jogo concluído). */
export const isGameComplete = (phaseIndex: number): boolean => phaseIndex >= TOTAL_PHASES;

const createWord = (word: string, pronunciations: string[] = []): WordPronunciation => ({
    word,
    pronunciations,
});

/**
 * Palavras de cada letra, indexadas pela própria letra (e não pela posição),
 * para que o conteúdo nunca fique desalinhado em relação à fase atual.
 */
export const WordsByLetter: Record<string, WordSet> = {
    A: {
        word1: createWord("Ave"),
        word2: createWord("Asa"),
        word3: createWord("Aba"),
    },
    E: {
        word1: createWord("Ae", ["Ai", "A"]),
        word2: createWord("Ea"),
        word3: createWord("Ee"),
    },
    I: {
        word1: createWord("Ai"),
        word2: createWord("Ei", ["E"]),
        word3: createWord("Ia", ["E a"]),
    },
    O: {
        word1: createWord("Oi"),
        word2: createWord("Ioio", ["e ou", "e olhou", "e ou e o", "e o"]),
        word3: createWord("Oie", ["oi e", "oi"]),
    },
    U: {
        word1: createWord("Eu"),
        word2: createWord("Uau"),
        word3: createWord("Au"),
    },
    B: {
        word1: createWord("Baba"),
        word2: createWord("Bebe"),
        word3: createWord("Boba"),
    },
    C: {
        word1: createWord("Bico"),
        word2: createWord("Cabo"),
        word3: createWord("Coco"),
    },
    D: {
        word1: createWord("Dado"),
        word2: createWord("Dedo"),
        word3: createWord("Educado"),
    },
    F: {
        word1: createWord("Fada"),
        word2: createWord("Bafo"),
        word3: createWord("Fofa"),
    },
    G: {
        word1: createWord("Gago"),
        word2: createWord("Goiaba"),
        word3: createWord("Cego"),
    },
    H: {
        word1: createWord("Haha"),
        word2: createWord("Hehe"),
        word3: createWord("Hihi"),
    },
    J: {
        word1: createWord("Jaca"),
        word2: createWord("Jiboia"),
        word3: createWord("Jogo"),
    },
    K: {
        word1: createWord("Kiwi", ["quivi"]),
        word2: createWord("Koala", ["coala"]),
        word3: createWord("Kart", ["carte", "karte"]),
    },
    L: {
        word1: createWord("Lago"),
        word2: createWord("Loja"),
        word3: createWord("Bola"),
    },
    M: {
        word1: createWord("Magia"),
        word2: createWord("Cama"),
        word3: createWord("Mala"),
    },
    N: {
        word1: createWord("Boneca"),
        word2: createWord("Nanico"),
        word3: createWord("Nada"),
    },
    P: {
        word1: createWord("Pai"),
        word2: createWord("Palco"),
        word3: createWord("Cana"),
    },
    Q: {
        word1: createWord("Quero"),
        word2: createWord("Quilo"),
        word3: createWord("Aqui"),
    },
    R: {
        word1: createWord("Rato"),
        word2: createWord("Roda"),
        word3: createWord("Caro"),
    },
    S: {
        word1: createWord("Sapo"),
        word2: createWord("Sino"),
        word3: createWord("Casa"),
    },
    T: {
        word1: createWord("Tatu"),
        word2: createWord("Teto"),
        word3: createWord("Bota"),
    },
    V: {
        word1: createWord("Vaca"),
        word2: createWord("Vela"),
        word3: createWord("Cova"),
    },
    W: {
        word1: createWord("Wafer", ["uafer", "ueifer"]),
        word2: createWord("Web", ["ueb", "uebi"]),
        word3: createWord("Watt", ["uate", "uati"]),
    },
    X: {
        word1: createWord("Xale"),
        word2: createWord("Xixi"),
        word3: createWord("Xadrez"),
    },
    Y: {
        word1: createWord("Yoga", ["ioga"]),
        word2: createWord("Yakisoba", ["iakisoba", "iaquissoba"]),
        word3: createWord("Yeti", ["ieti"]),
    },
    Z: {
        word1: createWord("Zebra"),
        word2: createWord("Zona"),
        word3: createWord("Zero"),
    },
};

/** Retorna as palavras da letra da fase indicada (ou undefined se a fase não existir). */
export function getWordSetForPhase(phaseIndex: number): WordSet | undefined {
    const letter = Letters[phaseIndex]?.letter;
    return letter ? WordsByLetter[letter] : undefined;
}

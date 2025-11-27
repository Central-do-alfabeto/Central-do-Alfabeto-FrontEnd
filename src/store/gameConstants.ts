export const Letters = [
    "A", "E", "I", "O", "U", "B", "C", "D", "F", "G",
    "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S",
    "T","V", "W", "X", "Y", "Z"
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

const createWord = (word: string, pronunciations: string[] = []): WordPronunciation => ({
    word,
    pronunciations,
});

export const Words: WordSet[] = [
    {
        word1: createWord("Ae"),
        word2: createWord("Ea"),
        word3: createWord("Ee"),
    },
    {
        word1: createWord("Ai"),
        word2: createWord("Ei"),
        word3: createWord("Ia"),
    },
    {
        word1: createWord("Oi"),
        word2: createWord("Ioio", ["e ou", "e olhou", "e ou e o", "e o"]),
        word3: createWord("Oie", ["oi e"]),
    },
    {
        word1: createWord("Eu"),
        word2: createWord("Uau"),
        word3: createWord("Au"),
    },
    {
        word1: createWord("Baba"),
        word2: createWord("Bebe"),
        word3: createWord("Boba"),
    },
    {
        word1: createWord("Bico"),
        word2: createWord("Cabo"),
        word3: createWord("Coco"),
    },
    {
        word1: createWord("Dado"),
        word2: createWord("Dedo"),
        word3: createWord("Educado"),
    },
    {
        word1: createWord("Fada"),
        word2: createWord("Bafo"),
        word3: createWord("Fofa"),
    },
    {
        word1: createWord("Gago"),
        word2: createWord("Goiaba"),
        word3: createWord("Cego"),
    },
    {
        word1: createWord("Haha"),
        word2: createWord("Hehe"),
        word3: createWord("Hihi"),
    },
    {
        word1: createWord("Jaca"),
        word2: createWord("Jiboia"),
        word3: createWord("Jogo"),
    },
    {
        word1: createWord("Lago"),
        word2: createWord("Loja"),
        word3: createWord("Bola"),
    },
    {
        word1: createWord("Magia"),
        word2: createWord("Cama"),
        word3: createWord("Mala"),
    },
    {
        word1: createWord("Boneca"),
        word2: createWord("Nanico"),
        word3: createWord("Nada"),
    },
    {
        word1: createWord("Pai"),
        word2: createWord("Palco"),
        word3: createWord("Cana"),
    },
    {
        word1: createWord("Quero"),
        word2: createWord("Quilo"),
        word3: createWord("Aqui"),
    },
    {
        word1: createWord("Rato"),
        word2: createWord("Roda"),
        word3: createWord("Caro"),
    },
    {
        word1: createWord("Sapo"),
        word2: createWord("Sino"),
        word3: createWord("Casa"),
    },
    {
        word1: createWord("Tatu"),
        word2: createWord("Teto"),
        word3: createWord("Bota"),
    },
    {
        word1: createWord("Vaca"),
        word2: createWord("Vela"),
        word3: createWord("Cova"),
    },
    {
        word1: createWord("Xale"),
        word2: createWord("Xixi"),
        word3: createWord("Xadrez"),
    },
    {
        word1: createWord("Zebra"),
        word2: createWord("Zona"),
        word3: createWord("Zero"),
    },
];
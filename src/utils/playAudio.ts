import { incrementTotalAudioReproductions } from "../store/gameState";
import type { Dispatch, SetStateAction } from "react";

/**
 * Único ponto de reprodução de áudio do jogo.
 *
 * Ordem de tentativas para um nome de áudio:
 * 1. arquivo `public/audio/<nome>.mp3`;
 * 2. o mesmo arquivo com o nome em minúsculas (vários arquivos usam esse padrão);
 * 3. síntese de voz do navegador (`speechSynthesis`, pt-BR) lendo o texto equivalente,
 *    usada quando o arquivo não existe ou não carrega.
 *
 * Se o navegador bloquear a reprodução automática (falta de gesto do usuário), não há
 * fallback: a síntese de voz sofreria o mesmo bloqueio.
 *
 * Só existe uma reprodução ativa por vez: iniciar outra para a anterior, e eventos de
 * reproduções já substituídas ou paradas são ignorados.
 */

const SPEECH_LANG = "pt-BR";

const FIXED_TEXTS: Record<string, string> = {
  tela_inicial: "Bem-vindo à Central do Alfabeto! Aperte iniciar para jogar.",
  introdução: "Bem-vindo à Central do Alfabeto! Vamos aprender as letras do alfabeto juntos.",
  resposta_correta: "Muito bem!",
  resposta_errada: "Tente de novo.",
  repita_letra_mostrada: "Repita a letra mostrada.",
  repita_palavra_mostrada: "Repita as palavras mostradas.",
  fim_de_jogo: "Parabéns! Você aprendeu todas as letras do alfabeto!",
  silabas_com_2_vogais: "Sílabas com duas vogais.",
  silabas_com_3_vogais: "Sílabas com três vogais.",
  aperte_verde_ou_vermelho: "Aperte o botão verde ou o vermelho.",
};

/** Texto lido pela síntese de voz quando o arquivo de áudio não está disponível. */
export function getSpokenText(audioName: string): string {
  const fixed = FIXED_TEXTS[audioName];
  if (fixed) return fixed;

  const presentation = /^essa_letra_(.+)_alfabeto$/i.exec(audioName);
  if (presentation) return `Esta é a letra ${presentation[1]}.`;

  const congratulations = /^parabens_aprendeu_(.+)$/i.exec(audioName);
  if (congratulations) return `Parabéns! Você aprendeu a letra ${congratulations[1]}!`;

  const selectLetter = /^selecione_letra_(.+)$/i.exec(audioName);
  if (selectLetter) return `Selecione a letra ${selectLetter[1]}.`;

  const selectWord = /^selecione_palavra_(.+)$/i.exec(audioName);
  if (selectWord) return `Selecione a palavra ${selectWord[1]}.`;

  const word = /^palavra_(.+)$/i.exec(audioName);
  if (word) return word[1];

  const syllable = /^silaba_(.+)$/i.exec(audioName);
  if (syllable) return syllable[1].toLowerCase();

  return audioName.replace(/_/g, " ");
}

type SetRunning = Dispatch<SetStateAction<boolean>>;
type FileResult = "played" | "blocked" | "missing";

/** A reprodução ativa (arquivo ou voz sintetizada). */
type Playback = {
  setRunning: SetRunning;
  audio?: HTMLAudioElement;
  usedSpeech?: boolean;
  timer?: ReturnType<typeof setTimeout>;
};

let active: Playback | null = null;

function halt(playback: Playback) {
  playback.audio?.pause();
  if (playback.timer) clearTimeout(playback.timer);
  if (playback.usedSpeech && typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Para a reprodução ativa. Com `owner`, só para se ela pertence a essa tela (o setter de
 * `useAudioRunning`), para que a tela que sai não corte a narração da tela que entra.
 */
export function stopAudio(owner?: SetRunning): void {
  const playback = active;
  if (!playback || (owner && playback.setRunning !== owner)) return;
  active = null;
  halt(playback);
  playback.setRunning(false);
}

function setRunningIfCurrent(playback: Playback, value: boolean) {
  if (active === playback) playback.setRunning(value);
}

function buildAudioPath(name: string): string {
  const baseUrl = import.meta.env.BASE_URL ?? "/";
  const encodedName = encodeURIComponent(`${name}.mp3`).replace(/%20/g, " ");
  return `${baseUrl}audio/${encodedName}`;
}

/** Tenta tocar um arquivo. "missing" cobre 404, formato inválido e qualquer falha de carregamento. */
function tryPlayFile(name: string, playback: Playback): Promise<FileResult> {
  return new Promise((resolve) => {
    let settled = false;
    let started = false;
    const finish = (result: FileResult) => {
      if (!settled) {
        settled = true;
        resolve(result);
      }
    };

    try {
      const audio = new Audio(buildAudioPath(name));
      playback.audio = audio;

      audio.addEventListener("ended", () => setRunningIfCurrent(playback, false), { once: true });
      audio.addEventListener("error", () => {
        // Falha no meio da reprodução libera a interface; falha de carregamento segue para o fallback.
        if (started) setRunningIfCurrent(playback, false);
        finish("missing");
      });

      audio
        .play()
        .then(() => {
          started = true;
          setRunningIfCurrent(playback, true);
          finish("played");
        })
        .catch((error: unknown) => {
          const blocked = error instanceof DOMException && error.name === "NotAllowedError";
          finish(blocked ? "blocked" : "missing");
        });
    } catch {
      finish("missing");
    }
  });
}

function pickPortugueseVoice(synth: SpeechSynthesis): SpeechSynthesisVoice | undefined {
  const voices = synth.getVoices?.() ?? [];
  return (
    voices.find((voice) => voice.lang.replace("_", "-").toLowerCase() === "pt-br") ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("pt"))
  );
}

/** Lê o texto com a síntese de voz do navegador. Devolve false se ela não estiver disponível. */
function speak(text: string, playback: Playback): boolean {
  if (
    typeof window === "undefined" ||
    !("speechSynthesis" in window) ||
    typeof SpeechSynthesisUtterance === "undefined"
  ) {
    return false;
  }

  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = SPEECH_LANG;
  const voice = pickPortugueseVoice(synth);
  if (voice) utterance.voice = voice;

  // Alguns navegadores não disparam "end"; o temporizador evita deixar os botões travados.
  playback.timer = setTimeout(() => setRunningIfCurrent(playback, false), 3000 + text.length * 120);
  const done = () => {
    if (playback.timer) clearTimeout(playback.timer);
    setRunningIfCurrent(playback, false);
  };
  utterance.onend = done;
  utterance.onerror = done;

  playback.usedSpeech = true;
  synth.cancel();
  playback.setRunning(true);
  synth.speak(utterance);
  return true;
}

async function playWithFallback(name: string, playback: Playback): Promise<void> {
  const candidates = Array.from(new Set([name, name.toLowerCase()]));

  for (const candidate of candidates) {
    const result = await tryPlayFile(candidate, playback);
    if (active !== playback) return; // foi parada ou substituída enquanto carregava
    if (result === "played") return;
    if (result === "blocked") {
      playback.setRunning(false);
      console.warn(`Reprodução de "${name}" bloqueada pelo navegador (requer interação do usuário).`);
      return;
    }
  }

  console.warn(`Áudio "${name}" indisponível; usando a síntese de voz do navegador.`);
  if (!speak(getSpokenText(name), playback)) {
    playback.setRunning(false);
    console.error(`Não foi possível reproduzir o áudio "${name}".`);
  }
}

export function playAudio(name: string, setUseAudioRunning: SetRunning, btnClicked: boolean = false): void {
  if (btnClicked) incrementTotalAudioReproductions();

  // Uma única reprodução por vez: a anterior (arquivo ou voz) é parada sem avisar a interface.
  if (active) halt(active);

  const playback: Playback = { setRunning: setUseAudioRunning };
  active = playback;
  void playWithFallback(name, playback);
}

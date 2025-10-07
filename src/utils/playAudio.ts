import { incrementTotalAudioReproductions } from "../store/gameState";
import type { Dispatch, SetStateAction } from "react";

export function playAudio(
  name: string,
  setUseAudioRunning: Dispatch<SetStateAction<boolean>>,
  btnClicked: boolean = false
): void {
  const audioPath = `/audio/audio_${name}.mp3`;
  const audio = new Audio(audioPath);

  if (btnClicked) incrementTotalAudioReproductions();

  audio.addEventListener(
    "ended",
    () => {
      setUseAudioRunning(false);
    },
    { once: true }
  );

  audio
    .play()
    .then(() => {
      setUseAudioRunning(true);
      console.log(`Reproduzindo: audio_${name}.mp3`);
    })
    .catch((err) => {
      setUseAudioRunning(false);
      console.error("Erro ao reproduzir o áudio:", err);
    });
}


// import { incrementTotalAudioReproductions } from "../store/gameState";
// import type { Dispatch, SetStateAction } from "react";

// /**
//  * Versão simples: corrigida para usar mp3, caminho público correto e tratamento de Promise.
//  * Mantém assinatura void para compatibilidade com seu uso atual.
//  */
// export function playAudio(
//   name: string,
//   setUseAudioRunning: Dispatch<SetStateAction<boolean>>,
//   btnClicked: boolean = false
// ): void {
//   const audioPath = `/audio/audio_${name}.mp3`; // arquivos em public/ são servidos a partir da raiz
//   const audio = new Audio(audioPath);

//   if (btnClicked) incrementTotalAudioReproductions();

//   // registra ended com opção once para não acumular listeners
//   audio.addEventListener(
//     "ended",
//     () => {
//       setUseAudioRunning(false);
//     },
//     { once: true }
//   );

//   audio
//     .play()
//     .then(() => {
//       setUseAudioRunning(true); // só marca como rodando se o play() funcionou
//       console.log(`Reproduzindo: audio_${name}.mp3`);
//     })
//     .catch((err) => {
//       setUseAudioRunning(false);
//       // Erro pode vir por autoplay bloqueado, arquivo não encontrado, etc.
//       console.error("Erro ao reproduzir o áudio:", err);
//     });
// }

// /**
//  * Versão recomendada: reusa instâncias de Audio por nome e retorna a instância criada,
//  * permitindo pausar/ajustar volume externamente e evitando múltiplas instâncias duplicadas.
//  */
// const audioCache = new Map<string, HTMLAudioElement>();

// export function playAudioManaged(
//   name: string,
//   setUseAudioRunning: Dispatch<SetStateAction<boolean>>,
//   btnClicked: boolean = false
// ): HTMLAudioElement {
//   const key = name;
//   const audioPath = `/audio/audio_${name}.mp3`;
//   let audio = audioCache.get(key);

//   if (!audio) {
//     audio = new Audio(audioPath);
//     audio.preload = "auto";
//     audioCache.set(key, audio);
//   } else {
//     // atualiza src caso necessário (por exemplo se extensão/rota mudar)
//     if (audio.src && !audio.src.endsWith(`/audio/audio_${name}.mp3`)) {
//       audio.src = audioPath;
//     }
//   }

//   if (btnClicked) incrementTotalAudioReproductions();

//   const onEnded = () => {
//     setUseAudioRunning(false);
//     audio?.removeEventListener("ended", onEnded);
//   };
//   audio.addEventListener("ended", onEnded);

//   audio
//     .play()
//     .then(() => {
//       setUseAudioRunning(true);
//       console.log(`Reproduzindo: audio_${name}.mp3`);
//     })
//     .catch((err) => {
//       setUseAudioRunning(false);
//       console.error("Erro ao reproduzir o áudio:", err);
//     });

//   return audio;
// }

// /**
//  * Utilitário para parar/limpar um áudio do cache se precisar:
//  */
// export function stopAndClearAudio(name: string) {
//   const key = name;
//   const audio = audioCache.get(key);
//   if (audio) {
//     audio.pause();
//     audio.currentTime = 0;
//     audioCache.delete(key);
//   }
// }

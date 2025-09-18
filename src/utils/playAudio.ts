import { incrementTotalAudioReproductions } from "../store/gameState";
import type { Dispatch, SetStateAction } from "react";

export function playAudio(name: string, setUseAudioRunning: Dispatch<SetStateAction<boolean>>, btnCLicked: boolean = false): void {
  const audioPath = `../public/audio/audio_${name}.mp4`;
  const audio = new Audio(audioPath);

  if(btnCLicked) incrementTotalAudioReproductions();

  audio.play()
    .then(() => {
      console.log(`Reproduzindo: audio_${name}.mp4`);
      setUseAudioRunning(true);
    })
    .catch(err => {
      console.error("Erro ao reproduzir o áudio:", err);
    });

  audio.addEventListener('ended', () => {
    setUseAudioRunning(false);
  });
}
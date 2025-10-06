import { incrementTotalAudioReproductions } from "../store/gameState";

export function playAudio(name: string, btnCLicked: boolean = false): void {
  const audioPath = `../public/audio/audio_${name}.mp4`;
  const audio = new Audio(audioPath);

  if(btnCLicked) incrementTotalAudioReproductions();

  audio.play()
    .then(() => {
      console.log(`Reproduzindo: audio_${name}.mp4`);
    })
    .catch(err => {
      console.error("Erro ao reproduzir o áudio:", err);
    });
}
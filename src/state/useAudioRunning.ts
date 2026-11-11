import { useEffect, useRef, useState } from "react";
import { stopAudio } from "../utils/playAudio";

/**
 * Estado "há áudio tocando" de uma tela. Ao desmontar a tela, a narração dela é parada
 * para não continuar depois da navegação nem se sobrepor à da tela seguinte.
 */
export function useAudioRunning(initialValue = false): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const [audioRunning, setAudioRunning] = useState(initialValue);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      // No StrictMode (dev) o componente é remontado em seguida; só para se realmente saiu.
      queueMicrotask(() => {
        if (!mounted.current) stopAudio(setAudioRunning);
      });
    };
  }, []);

  return [audioRunning, setAudioRunning];
}

import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { playAudio } from "../utils/playAudio";

export default function useOneShotAudio(
  shouldPlay: boolean,
  audioName: string | null,
  setAudioRunning: Dispatch<SetStateAction<boolean>>
) {
  const lastAudioNameRef = useRef<string | null>(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (audioName !== lastAudioNameRef.current) {
      lastAudioNameRef.current = audioName;
      hasPlayedRef.current = false;
    }

    if (!shouldPlay || !audioName || hasPlayedRef.current) {
      return;
    }

    hasPlayedRef.current = true;
    playAudio(audioName, setAudioRunning);
  }, [audioName, shouldPlay, setAudioRunning]);
}

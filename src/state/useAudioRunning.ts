import { useState } from "react";

export function useAudioRunning(initialValue = false): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const [audioRunning, setAudioRunning] = useState(initialValue);
  return [audioRunning, setAudioRunning];
}

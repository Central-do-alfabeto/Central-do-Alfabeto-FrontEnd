// src/state/showText.ts
import { useEffect, useState } from "react";

let globalShowText = false;
const listeners = new Set<(value: boolean) => void>();

export function useShowText() {
  const [showText, setShowTextState] = useState(globalShowText);

  const setShowText = (value: boolean) => {
    globalShowText = value;
    setShowTextState(value);
    listeners.forEach((listener) => listener(value));
  };

  useEffect(() => {
    const listener = (value: boolean) => setShowTextState(value);
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }, []);

  return [showText, setShowText] as const;
}

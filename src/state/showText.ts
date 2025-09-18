// src/state/showText.ts
import { useState } from "react";

let globalShowText = false;
let listeners: ((value: boolean) => void)[] = [];

export function useShowText() {
  const [showText, setShowTextState] = useState(globalShowText);

  const setShowText = (value: boolean) => {
    globalShowText = value;
    setShowTextState(value);
    listeners.forEach((listener) => listener(value));
  };

  // registra listener para atualizar estado caso globalShowText mude fora deste hook
  listeners.push(setShowTextState);

  return [showText, setShowText] as const;
}

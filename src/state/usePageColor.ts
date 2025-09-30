import { useState } from "react";
import { type PaletaCores, paletasDisponiveis } from "../store/paletaCores";

let globalPaleta: PaletaCores = paletasDisponiveis.clara;
const listeners: ((paleta: PaletaCores) => void)[] = [];

export function usePageColor() {
  const [paleta, setPaleta] = useState(globalPaleta);

  const setGlobalPaleta = (nomePaleta: keyof typeof paletasDisponiveis) => {
    globalPaleta = paletasDisponiveis[nomePaleta];
    setPaleta(globalPaleta);
    listeners.forEach((listener) => listener(globalPaleta));
  };

  listeners.push(setPaleta);
  return [paleta, setGlobalPaleta] as const;
}
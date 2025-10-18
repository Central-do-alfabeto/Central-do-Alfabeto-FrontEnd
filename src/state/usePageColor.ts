import { useEffect, useState } from "react";
import {
  type PaletaCores,
  type PaletaDisponivel,
  paletasDisponiveis,
} from "../store/paletaCores";

const STORAGE_KEY = "ui.palettePreference";
const listeners: ((paleta: PaletaCores) => void)[] = [];

const isBrowser = typeof window !== "undefined";

function resolveInitialPaletteKey(): PaletaDisponivel {
  if (!isBrowser) {
    return "azul";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY) as
    | PaletaDisponivel
    | null;

  if (stored && stored in paletasDisponiveis) {
    return stored;
  }

  return "azul";
}

let globalPaletaKey: PaletaDisponivel = resolveInitialPaletteKey();
let globalPaleta: PaletaCores = paletasDisponiveis[globalPaletaKey];

function applyPalette(paleta: PaletaCores) {
  if (!isBrowser) {
    return;
  }

  const root = document.documentElement;

  root.style.setProperty("--color-background", paleta.background);
  root.style.setProperty("--color-surface-soft", paleta.surfaceSoft);
  root.style.setProperty("--color-surface", paleta.surface);
  root.style.setProperty("--color-surface-hover", paleta.surfaceHover);
  root.style.setProperty("--color-text", paleta.text);
  root.style.setProperty("--color-on-surface", paleta.onSurface);

  document.body.style.backgroundColor = paleta.background;
  document.body.style.color = paleta.text;
}

if (isBrowser) {
  applyPalette(globalPaleta);
}

export function usePageColor() {
  const [paleta, setPaleta] = useState(globalPaleta);

  useEffect(() => {
    const listener = (nextPaleta: PaletaCores) => {
      setPaleta(nextPaleta);
    };

    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index >= 0) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const setGlobalPaleta = (nomePaleta: PaletaDisponivel) => {
    globalPaletaKey = nomePaleta;
    globalPaleta = paletasDisponiveis[nomePaleta];

    if (isBrowser) {
      window.localStorage.setItem(STORAGE_KEY, nomePaleta);
    }

    applyPalette(globalPaleta);
    listeners.forEach((listener) => listener(globalPaleta));
  };

  return [paleta, setGlobalPaleta] as const;
}
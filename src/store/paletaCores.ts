export interface PaletaCores {
  background: string;
  surfaceSoft: string;
  surface: string;
  surfaceHover: string;
  text: string;
  onSurface: string;
}

export const paletasDisponiveis = {
  azul: {
    background: "#e3f2fd",
    surfaceSoft: "#bbdefb",
    surface: "#1976d2",
    surfaceHover: "#1565c0",
    text: "#0d47a1",
    onSurface: "#ffffff",
  },
  vermelho: {
    background: "#ffebee",
    surfaceSoft: "#ffcdd2",
    surface: "#d32f2f",
    surfaceHover: "#b71c1c",
    text: "#b71c1c",
    onSurface: "#ffffff",
  },
  verde: {
    background: "#e8f5e9",
    surfaceSoft: "#c8e6c9",
    surface: "#2e7d32",
    surfaceHover: "#1b5e20",
    text: "#1b5e20",
    onSurface: "#ffffff",
  },
} as const;

export type PaletaDisponivel = keyof typeof paletasDisponiveis;
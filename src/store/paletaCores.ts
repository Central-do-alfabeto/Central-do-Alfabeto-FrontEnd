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
    surface: "#42a5f5",
    surfaceHover: "#1e88e5",
    text: "#0d47a1",
    onSurface: "#ffffff",
  },
  vermelho: {
    background: "#ffebee",
    surfaceSoft: "#ffcdd2",
    surface: "#ef5350",
    surfaceHover: "#e53935",
    text: "#b71c1c",
    onSurface: "#ffffff",
  },
  verde: {
    background: "#e8f5e9",
    surfaceSoft: "#c8e6c9",
    surface: "#66bb6a",
    surfaceHover: "#43a047",
    text: "#1b5e20",
    onSurface: "#ffffff",
  },
} as const;

export type PaletaDisponivel = keyof typeof paletasDisponiveis;
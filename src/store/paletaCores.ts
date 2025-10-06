export interface PaletaCores {
  primaria: string;
  secundaria: string;
  background: string;
}

export const paletasDisponiveis: Record<string, PaletaCores> = {
  clara: {
    primaria: '#34dbbcff',
    secundaria: '#2f8624ff',
    background: '#115d4cff'
  },
  escura: {
    primaria: '#2980b9',
    secundaria: '#133980ff',
    background: '#291a55ff'
  },
  neutra: {
    primaria: '#95a5a6',
    secundaria: '#7f8c8d',
    background: '#ecf0f1'
  }
};
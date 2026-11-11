import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GameComplete from "./GameComplete";

vi.mock("../../utils/playAudio", () => ({ playAudio: vi.fn() }));

describe("GameComplete", () => {
  it("mostra a tela de conclusão com botão para voltar ao menu", () => {
    render(
      <MemoryRouter>
        <GameComplete />
      </MemoryRouter>
    );

    // Consultas por nome: no modo demonstração a tela também mostra "recomeçar do início".
    expect(screen.getByRole("status", { name: /aprendeu todas as letras/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /voltar ao menu/i })).toBeInTheDocument();
  });
});

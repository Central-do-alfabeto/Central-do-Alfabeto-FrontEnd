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

    expect(screen.getByRole("status")).toHaveAccessibleName(/aprendeu todas as letras/i);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});

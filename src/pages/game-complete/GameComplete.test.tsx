import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GameComplete from "./GameComplete";

vi.mock("../../utils/playAudio", () => ({ playAudio: vi.fn() }));

function renderScreen() {
  render(
    <MemoryRouter>
      <GameComplete />
    </MemoryRouter>
  );
}

describe("GameComplete", () => {
  it("com backend, mostra a conclusão e o botão de voltar ao menu", () => {
    vi.stubEnv("VITE_API_URL", "http://localhost:8080");
    renderScreen();

    expect(screen.getByRole("status", { name: /aprendeu todas as letras/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /voltar ao menu/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /recomeçar do início/i })).not.toBeInTheDocument();
  });

  it("no modo demonstração, também oferece recomeçar do início", () => {
    vi.stubEnv("VITE_API_URL", "");
    renderScreen();

    expect(screen.getByRole("status", { name: /aprendeu todas as letras/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /voltar ao menu/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /recomeçar do início/i })).toBeInTheDocument();
  });
});

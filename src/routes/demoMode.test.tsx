import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const { post, get, request } = vi.hoisted(() => ({ post: vi.fn(), get: vi.fn(), request: vi.fn() }));

vi.mock("../services/api/apiClient", () => ({
  default: { post, get, request, interceptors: { request: { use: vi.fn() } } },
}));
vi.mock("../utils/playAudio", () => ({ playAudio: vi.fn(), stopAudio: vi.fn() }));

import { Router } from "./private/router";
import GameSectionCongratulations from "../pages/game-sections/GameSectionCongratulations";
import { markPhaseCompletion } from "../store/phaseCompletion";
import { readLocalProgress } from "../services/progress/localProgress";

function expectNoHttp() {
  expect(post).not.toHaveBeenCalled();
  expect(get).not.toHaveBeenCalled();
  expect(request).not.toHaveBeenCalled();
}

describe("modo demonstração (sem VITE_API_URL)", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_API_URL", "");
    post.mockReset();
    get.mockReset();
    request.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    window.history.pushState({}, "", "/");
  });

  it.each(["/", "/Login", "/Register", "/EducatorDashboard"])(
    "a rota %s leva direto ao menu do jogador",
    async (path) => {
      window.history.pushState({}, "", path);
      render(<Router />);

      expect(await screen.findByRole("button", { name: "INICIAR" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /recomeçar do início/i })).toBeInTheDocument();
      expectNoHttp();
    }
  );

  it("salva o progresso no localStorage ao concluir a fase, sem chamadas HTTP", async () => {
    markPhaseCompletion(0, 0, 0);
    render(
      <MemoryRouter>
        <GameSectionCongratulations />
      </MemoryRouter>
    );

    expect(await screen.findByText(/progresso salvo/i)).toBeInTheDocument();
    expect(readLocalProgress().currentPhaseIndex).toBe(1);
    expectNoHttp();
  });

  it("recomeçar pede confirmação e apaga o progresso", async () => {
    localStorage.setItem(
      "centralDoAlfabeto.demo.progress.v1",
      JSON.stringify({ currentPhaseIndex: 7, snapshots: [] })
    );
    window.history.pushState({}, "", "/PlayerMenu");
    render(<Router />);

    fireEvent.click(await screen.findByRole("button", { name: /recomeçar do início/i }));
    expect(screen.getByRole("alertdialog")).toHaveTextContent(/apagado/i);
    expect(readLocalProgress().currentPhaseIndex).toBe(7);

    fireEvent.click(screen.getByRole("button", { name: /sim, recomeçar/i }));
    await waitFor(() => expect(readLocalProgress().currentPhaseIndex).toBe(0));
    expect(screen.getByText(/voltou para a letra A/i)).toBeInTheDocument();
    expectNoHttp();
  });
});

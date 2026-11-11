import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("../../utils/playAudio", () => ({ playAudio: vi.fn() }));

const MARKER_KEY = "phaseCompletion.v1";
const PROGRESS_KEY = "centralDoAlfabeto.demo.progress.v1";

function readProgress() {
  return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '{"currentPhaseIndex":0,"snapshots":[]}') as {
    currentPhaseIndex: number;
    snapshots: Array<{ phaseIndex: number }>;
  };
}

/** Simula um recarregamento (F5): os módulos são recriados e só o storage sobrevive. */
async function loadScreenAfterReload() {
  vi.resetModules();
  const { default: Screen } = await import("./GameSectionCongratulations");
  return Screen;
}

async function renderScreen() {
  const Screen = await loadScreenAfterReload();
  render(
    <MemoryRouter initialEntries={["/GameSectionCongratulations"]}>
      <Routes>
        <Route path="/GameSectionCongratulations" element={<Screen />} />
        <Route path="/PlayerMenu" element={<p>menu do jogador</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("GameSectionCongratulations: concluir a fase é idempotente (modo demonstração)", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_API_URL", "");
  });

  afterEach(() => {
    cleanup();
  });

  it("recarregar a tela não salva nem avança de novo", async () => {
    // O jogador acabou de concluir a fase da letra A (índice 0).
    sessionStorage.setItem(
      MARKER_KEY,
      JSON.stringify({ phase: 0, errors: 2, audioReproductions: 3, saved: false })
    );

    await renderScreen();
    expect(await screen.findByText(/progresso salvo/i)).toBeInTheDocument();
    expect(readProgress().currentPhaseIndex).toBe(1);
    expect(readProgress().snapshots.map((s) => s.phaseIndex)).toEqual([0]);

    // F5 três vezes
    for (let i = 0; i < 3; i++) {
      cleanup();
      await renderScreen();
      expect(await screen.findByText(/progresso salvo/i)).toBeInTheDocument();
    }

    expect(readProgress().currentPhaseIndex).toBe(1);
    expect(readProgress().snapshots.map((s) => s.phaseIndex)).toEqual([0]);
    expect(sessionStorage.getItem("currentPhaseIndex")).not.toBe("2");
  });

  it("acessar a URL sem ter concluído uma fase não concede progresso", async () => {
    await renderScreen();

    expect(await screen.findByText("menu do jogador")).toBeInTheDocument();
    expect(readProgress()).toEqual({ currentPhaseIndex: 0, snapshots: [] });
  });
});

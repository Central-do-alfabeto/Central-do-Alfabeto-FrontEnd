import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { post, get } = vi.hoisted(() => ({ post: vi.fn(), get: vi.fn() }));

vi.mock("../api/apiClient", () => ({
  default: { post, get, interceptors: { request: { use: vi.fn() } } },
}));

import { getProgressService, httpProgressService, localProgressService } from "./index";
import { LOCAL_PROGRESS_KEY, readLocalProgress, resetLocalProgress, saveLocalPhase } from "./localProgress";
import { setPlayerID } from "../../store/gameState";

describe("progresso local", () => {
  it("começa do início e guarda fases concluídas", () => {
    expect(readLocalProgress()).toEqual({ currentPhaseIndex: 0, snapshots: [] });

    saveLocalPhase({ currentPhaseIndex: 0, errorsData: 2, soundRepeatsData: 5 });
    saveLocalPhase({ currentPhaseIndex: 1, errorsData: 0, soundRepeatsData: 1 });

    const progress = readLocalProgress();
    expect(progress.currentPhaseIndex).toBe(2);
    expect(progress.snapshots).toEqual([
      { phaseIndex: 0, totalErrors: 2, totalAudioReproductions: 5 },
      { phaseIndex: 1, totalErrors: 0, totalAudioReproductions: 1 },
    ]);
  });

  it("repetir uma fase não faz o progresso voltar", () => {
    saveLocalPhase({ currentPhaseIndex: 3, errorsData: 0, soundRepeatsData: 0 });
    saveLocalPhase({ currentPhaseIndex: 1, errorsData: 1, soundRepeatsData: 1 });
    expect(readLocalProgress().currentPhaseIndex).toBe(4);
  });

  it("ignora dados corrompidos e permite recomeçar", () => {
    localStorage.setItem(LOCAL_PROGRESS_KEY, "{nao e json");
    expect(readLocalProgress().currentPhaseIndex).toBe(0);

    saveLocalPhase({ currentPhaseIndex: 5, errorsData: 0, soundRepeatsData: 0 });
    resetLocalProgress();
    expect(readLocalProgress()).toEqual({ currentPhaseIndex: 0, snapshots: [] });
  });
});

describe("serviço de progresso", () => {
  beforeEach(() => {
    post.mockReset().mockResolvedValue({ data: {} });
    get.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("sem VITE_API_URL usa a implementação local e não faz nenhuma chamada HTTP", async () => {
    vi.stubEnv("VITE_API_URL", "");
    const service = getProgressService();
    expect(service).toBe(localProgressService);

    await service.saveCompletedPhase({ currentPhaseIndex: 0, errorsData: 1, soundRepeatsData: 2 });

    expect(post).not.toHaveBeenCalled();
    expect(get).not.toHaveBeenCalled();
    expect(readLocalProgress().currentPhaseIndex).toBe(1);
  });

  it("com VITE_API_URL usa a API", async () => {
    vi.stubEnv("VITE_API_URL", "http://localhost:8080");
    setPlayerID("aluno-1");
    const service = getProgressService();
    expect(service).toBe(httpProgressService);

    const payload = { currentPhaseIndex: 4, errorsData: 0, soundRepeatsData: 3 };
    await service.saveCompletedPhase(payload);

    expect(post).toHaveBeenCalledWith("/players/aluno-1/progress", payload);
    expect(localStorage.getItem(LOCAL_PROGRESS_KEY)).toBeNull();
  });
});

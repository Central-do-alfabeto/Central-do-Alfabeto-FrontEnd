import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

const { stopAudio } = vi.hoisted(() => ({ stopAudio: vi.fn() }));
vi.mock("../utils/playAudio", () => ({ stopAudio }));

import { useAudioRunning } from "./useAudioRunning";

describe("useAudioRunning", () => {
  it("para a narração da tela quando ela é desmontada", async () => {
    const { result, unmount } = renderHook(() => useAudioRunning());
    const setter = result.current[1];

    expect(stopAudio).not.toHaveBeenCalled();
    unmount();
    await Promise.resolve();

    expect(stopAudio).toHaveBeenCalledWith(setter);
  });
});

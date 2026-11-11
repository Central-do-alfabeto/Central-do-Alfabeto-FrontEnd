import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const { loginAPI } = vi.hoisted(() => ({ loginAPI: vi.fn() }));
vi.mock("../../services/api/loginAPI", () => ({ loginAPI }));

import Login from "./Login";

describe("Login", () => {
  it("mostra o erro na própria tela, sem alert()", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    loginAPI.mockRejectedValue(new Error("401"));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "12345678" } });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/e-mail ou senha incorretos/i);
    expect(alertSpy).not.toHaveBeenCalled();
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiRequest } from "./apiClient";
import { saveAuthTokens } from "./authStorage";

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
}

describe("apiRequest", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("refreshes the access token once and retries after an unauthorized response", async () => {
    saveAuthTokens("expired-access", "refresh-token");
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(jsonResponse({ detail: "Token invalido" }, { status: 401 }))
      .mockResolvedValueOnce(jsonResponse({ access: "fresh-access" }))
      .mockResolvedValueOnce(jsonResponse({ ok: true }));

    const result = await apiRequest<{ ok: boolean }>("/produtores/");

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[2][1]).toMatchObject({
      headers: expect.objectContaining({
        Authorization: "Bearer fresh-access",
      }),
    });
  });

  it("throws a field error message returned by the API", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      jsonResponse({ cpf: ["CPF invalido."] }, { status: 400 }),
    );

    await expect(apiRequest("/produtores/")).rejects.toThrow("CPF invalido.");
  });
});

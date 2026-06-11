import { beforeEach, describe, expect, it } from "vitest";

import {
  readCache,
  RESOURCE_CACHE_KEYS,
  writeCache,
  writeResourceSnapshot,
} from "./localCache";

describe("localCache", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns the fallback and clears invalid cached JSON", () => {
    localStorage.setItem(RESOURCE_CACHE_KEYS.produtores, "{invalid");

    expect(readCache(RESOURCE_CACHE_KEYS.produtores, [])).toEqual([]);
    expect(localStorage.getItem(RESOURCE_CACHE_KEYS.produtores)).toBeNull();
  });

  it("writes cronogramas to both compatibility keys", () => {
    const cronogramas = [{ id: "1", atividade: "Visita tecnica" }];

    writeResourceSnapshot({ cronogramas });

    expect(readCache(RESOURCE_CACHE_KEYS.cronogramas, [])).toEqual(cronogramas);
    expect(readCache(RESOURCE_CACHE_KEYS.visitas, [])).toEqual(cronogramas);
  });

  it("round-trips typed cache values", () => {
    writeCache(RESOURCE_CACHE_KEYS.comunidades, [{ id: "1", nome: "Centro" }]);

    expect(readCache(RESOURCE_CACHE_KEYS.comunidades, [])).toEqual([
      { id: "1", nome: "Centro" },
    ]);
  });
});

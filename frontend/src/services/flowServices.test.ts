import { beforeEach, describe, expect, it, vi } from "vitest";

import { loginWithApi } from "./authApi";
import { getSyncQueue } from "./syncQueue";
import { saveProdutorApi } from "./produtoresApi";
import { saveCronogramaApi, saveDocumentoEmitidoApi } from "./resourcesApi";

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
}

describe("fluxos principais de servicos", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("realiza login e persiste usuario e tokens", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      jsonResponse({
        access: "access-token",
        refresh: "refresh-token",
        user: {
          id: 7,
          nome: "Tecnico IDAM",
          email: "tecnico@idam.local",
          tipo_usuario: "tecnico",
        },
      }),
    );

    const usuario = await loginWithApi("tecnico@idam.local", "senha-forte-123");

    expect(usuario).toMatchObject({
      id: "7",
      email: "tecnico@idam.local",
      tipo: "tecnico",
    });
    expect(localStorage.getItem("idamAccessToken")).toBe("access-token");
  });

  it("valida produtor antes de enviar para API", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");

    await expect(
      saveProdutorApi({
        nome: "Ma",
        cpf: "123",
        sexo: "",
        publico: "",
      }),
    ).rejects.toThrow("Informe o nome do produtor.");

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("salva produtor e consulta detalhe atualizado", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        jsonResponse({
          id: 12,
          nome_completo: "Maria da Silva",
          cpf: "52998224725",
          sexo: "feminino",
          publico: "mulher_adulta",
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          id: 12,
          nome_completo: "Maria da Silva",
          cpf: "52998224725",
          sexo: "feminino",
          publico: "mulher_adulta",
          culturas: [],
        }),
      );

    const produtor = await saveProdutorApi({
      nome: "Maria da Silva",
      cpf: "529.982.247-25",
      sexo: "feminino",
      publico: "mulher_adulta",
    });

    expect(produtor.id).toBe("12");
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8000/api/produtores/",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("salva cronograma e documento emitido via API", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        jsonResponse({
          id: 3,
          produtor_nome: "Maria",
          tecnico_nome: "Tecnico IDAM",
          dia_semana: "segunda",
          atividade: "Visita tecnica",
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          id: 4,
          produtor_nome: "Maria",
          produtor_cpf: "52998224725",
          tipo_documento: "Declaracao",
        }),
      );

    await expect(
      saveCronogramaApi({
        produtorNome: "Maria",
        tecnico: "Tecnico IDAM",
        diaSemana: "segunda",
        atividade: "Visita tecnica",
      }),
    ).resolves.toMatchObject({ id: "3" });
    await expect(
      saveDocumentoEmitidoApi({
        produtorNome: "Maria",
        produtorCpf: "52998224725",
        tipoDocumento: "Declaracao",
      }),
    ).resolves.toMatchObject({ id: "4" });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("mantem operacao temporariamente indisponivel na fila de sincronizacao", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      jsonResponse({ detail: "Servidor indisponivel" }, { status: 503 }),
    );

    await expect(
      saveCronogramaApi({
        produtorNome: "Maria",
        diaSemana: "segunda",
        atividade: "Visita tecnica",
      }),
    ).rejects.toThrow("Servidor indisponivel");

    expect(getSyncQueue()).toHaveLength(1);
    expect(getSyncQueue()[0]).toMatchObject({
      path: "/cronogramas/",
      method: "POST",
    });
  });
});

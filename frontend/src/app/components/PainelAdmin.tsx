import { useMemo, useState, type ReactNode } from "react";
import {
  Users,
  FileText,
  CalendarDays,
  ClipboardPenLine,
  BarChart3,
} from "lucide-react";

interface Produtor {
  id: string;
  nome: string;
  cpf: string;
  cadastradoPorId?: string;
  cadastradoPorNome?: string;
  tipoPesca?: string;
  rgPesca?: string;
  protocoloRgp?: string;
  perfil?: string[];
  atividades?: string[];
  [key: string]: unknown;
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: "adm" | "tecnico";
  [key: string]: unknown;
}

interface DocumentoGerado {
  id: string;
  produtorId?: string;
  produtorNome?: string;
  tipoDocumento?: string;
  geradoPorId?: string;
  geradoPorNome?: string;
  dataGeracao?: string;
  [key: string]: unknown;
}

interface CronogramaItem {
  id: string;
  criadoPorId?: string;
  criadoPorNome?: string;
  [key: string]: unknown;
}

interface ObservacaoItem {
  id: string;
  tecnicoResponsavelId?: string;
  tecnicoResponsavelNome?: string;
  tecnicoResponsavel?: string;
  [key: string]: unknown;
}

function Card({
  titulo,
  valor,
  icon,
  onClick,
}: {
  titulo: string;
  valor: number | string;
  icon: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border border-[#d8d6c9] bg-[#fbfaf5] p-5 text-left shadow-sm transition ${
        onClick ? "hover:-translate-y-0.5 hover:border-[#cfa64a] hover:shadow-md" : ""
      }`}
    >
      <span className="absolute inset-x-0 top-0 h-1 bg-[#e6c46a]" />
      <div className="mb-4 flex items-start justify-between gap-4">
        <p className="max-w-36 text-sm font-medium leading-5 text-[#466255]">
          {titulo}
        </p>
        <div className="rounded-lg bg-[#e8f1dc] p-2 text-[#245942] transition group-hover:bg-[#173f31] group-hover:text-white">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-semibold tracking-tight text-[#13251d]">
        {valor}
      </p>
    </button>
  );
}

export default function PainelAdmin() {
  const [usuarios] = useState<Usuario[]>(() => {
    const stored = localStorage.getItem("usuarios");
    return stored ? JSON.parse(stored) : [];
  });
  const [produtores] = useState<Produtor[]>(() => {
    const stored = localStorage.getItem("produtores");
    return stored ? JSON.parse(stored) : [];
  });
  const [documentos] = useState<DocumentoGerado[]>(() => {
    const stored = localStorage.getItem("historicoDocumentos");
    return stored ? JSON.parse(stored) : [];
  });
  const [cronogramas] = useState<CronogramaItem[]>(() => {
    const stored = localStorage.getItem("cronogramas");
    return stored ? JSON.parse(stored) : [];
  });
  const [observacoes] = useState<ObservacaoItem[]>(() => {
    const stored = localStorage.getItem("recomendacoesTecnicas");
    return stored ? JSON.parse(stored) : [];
  });

  const [secaoAtiva, setSecaoAtiva] = useState<
    "produtores" | "documentos" | "cronogramas" | "observacoes" | null
  >(null);

  function isPescador(produtor: Produtor) {
    return (
      produtor.tipoPesca ||
      produtor.rgPesca ||
      produtor.protocoloRgp ||
      produtor.perfil?.includes?.("Pescador") ||
      produtor.atividades?.includes?.("Pesca")
    );
  }

  function documentosDisponiveis(produtor: Produtor) {
    const docs = ["Declaração Oficial", "SEFAZ"];

    if (isPescador(produtor)) {
      docs.push("Declaração de Pescador", "SEFAZ Pescador");
    }

    return docs;
  }

  const tecnicos = useMemo(
    () => usuarios.filter((u) => u.tipo === "tecnico"),
    [usuarios]
  );

  const resumoTecnicos = useMemo(() => {
    return tecnicos.map((tecnico) => {
      const produtoresDoTecnico = produtores.filter(
        (p) => p.cadastradoPorId === tecnico.id
      ).length;

      const documentosDoTecnico = documentos.filter(
        (d) => d.geradoPorId === tecnico.id
      ).length;

      const cronogramasDoTecnico = cronogramas.filter(
        (c) => c.criadoPorId === tecnico.id
      ).length;

      const observacoesDoTecnico = observacoes.filter(
        (o) =>
          o.tecnicoResponsavelId === tecnico.id ||
          o.tecnicoResponsavelNome === tecnico.nome ||
          o.tecnicoResponsavel === tecnico.nome
      ).length;

      const faltam = Math.max(72 - produtoresDoTecnico, 0);
      const progresso = Math.min(
        Math.round((produtoresDoTecnico / 72) * 100),
        100
      );

      return {
        ...tecnico,
        produtoresDoTecnico,
        documentosDoTecnico,
        cronogramasDoTecnico,
        observacoesDoTecnico,
        faltam,
        progresso,
      };
    });
  }, [tecnicos, produtores, documentos, cronogramas, observacoes]);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl bg-[#173f31] text-white shadow-xl shadow-[#173f31]/10">
        <div className="bg-[linear-gradient(135deg,rgba(230,196,106,0.28),transparent_36%),linear-gradient(90deg,#173f31,#245942)] p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6c46a]">
                Centro de comando
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                Painel Administrativo
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
                Acompanhe técnicos, produtores, documentos e cronogramas com foco
                na operação de campo.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
                <p className="text-2xl font-semibold">{tecnicos.length}</p>
                <p className="text-xs text-white/70">Técnicos</p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
                <p className="text-2xl font-semibold">{produtores.length}</p>
                <p className="text-xs text-white/70">Produtores</p>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
                <p className="text-2xl font-semibold">{documentos.length}</p>
                <p className="text-xs text-white/70">Docs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card
          titulo="Produtores cadastrados"
          valor={produtores.length}
          icon={<Users className="w-5 h-5" />}
          onClick={() => setSecaoAtiva("produtores")}
        />

        <Card
          titulo="Documentos gerados"
          valor={documentos.length}
          icon={<FileText className="w-5 h-5" />}
          onClick={() => setSecaoAtiva("documentos")}
        />

        <Card
          titulo="Cronogramas"
          valor={cronogramas.length}
          icon={<CalendarDays className="w-5 h-5" />}
          onClick={() => setSecaoAtiva("cronogramas")}
        />

        <Card
          titulo="Observações técnicas"
          valor={observacoes.length}
          icon={<ClipboardPenLine className="w-5 h-5" />}
          onClick={() => setSecaoAtiva("observacoes")}
        />
      </div>

      {secaoAtiva === "produtores" && (
        <section className="rounded-2xl border border-[#d8d6c9] bg-[#fbfaf5] p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-[#13251d]">
            Produtores Cadastrados
          </h3>

          {produtores.length === 0 ? (
            <p className="text-[#607368]">
              Nenhum produtor cadastrado.
            </p>
          ) : (
            <div className="space-y-3">
              {produtores.map((produtor) => (
                <div
                  key={produtor.id}
                  className="space-y-3 rounded-xl border border-[#ded9c8] bg-white p-4"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#13251d]">
                        {produtor.nome}
                      </p>
                      <p className="text-sm text-[#607368]">
                        CPF: {produtor.cpf}
                      </p>
                    </div>

                    <div className="text-sm text-[#607368] md:text-right">
                      <p>Cadastrado por:</p>
                      <p className="font-medium text-[#13251d]">
                        {produtor.cadastradoPorNome || "Não informado"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm text-[#607368]">
                      Documentos disponíveis:
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {documentosDisponiveis(produtor).map((doc) => (
                        <span
                          key={doc}
                          className="rounded-full bg-[#e8f1dc] px-3 py-1 text-sm font-medium text-[#245942]"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {secaoAtiva === "documentos" && (
        <section className="rounded-2xl border border-[#d8d6c9] bg-[#fbfaf5] p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-[#13251d]">
            Documentos Gerados
          </h3>

          {documentos.length === 0 ? (
            <p className="text-[#607368]">
              Nenhum documento gerado.
            </p>
          ) : (
            <div className="space-y-3">
              {documentos.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-xl border border-[#ded9c8] bg-white p-4"
                >
                  <p className="font-medium text-[#13251d]">
                    {doc.tipoDocumento || "Documento sem tipo informado"}
                  </p>
                  <p className="text-sm text-[#607368]">
                    Produtor: {doc.produtorNome || "Não informado"}
                  </p>
                  <p className="text-sm text-[#607368]">
                    Gerado por: {doc.geradoPorNome || "Não informado"}
                  </p>
                  <p className="text-sm text-[#607368]">
                    Data: {doc.dataGeracao || "Não informada"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {secaoAtiva === "cronogramas" && (
        <section className="rounded-2xl border border-[#d8d6c9] bg-[#fbfaf5] p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-[#13251d]">
            Cronogramas
          </h3>

          {cronogramas.length === 0 ? (
            <p className="text-[#607368]">
              Nenhum cronograma cadastrado.
            </p>
          ) : (
            <div className="space-y-3">
              {cronogramas.map((cronograma) => (
                <div
                  key={cronograma.id}
                  className="rounded-xl border border-[#ded9c8] bg-white p-4"
                >
                  <p className="font-medium text-[#13251d]">
                    {String(cronograma.titulo || "Cronograma sem título")}
                  </p>
                  <p className="text-sm text-[#607368]">
                    Criado por:{" "}
                    {cronograma.criadoPorNome || "Não informado"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {secaoAtiva === "observacoes" && (
        <section className="rounded-2xl border border-[#d8d6c9] bg-[#fbfaf5] p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-[#13251d]">
            Observações Técnicas
          </h3>

          {observacoes.length === 0 ? (
            <p className="text-[#607368]">
              Nenhuma observação registrada.
            </p>
          ) : (
            <div className="space-y-3">
              {observacoes.map((obs) => (
                <div
                  key={obs.id}
                  className="rounded-xl border border-[#ded9c8] bg-white p-4"
                >
                  <p className="font-medium text-[#13251d]">
                    {String(obs.titulo || "Observação técnica")}
                  </p>
                  <p className="text-sm text-[#607368]">
                    Técnico:{" "}
                    {String(
                      obs.tecnicoResponsavelNome ||
                        obs.tecnicoResponsavel ||
                        "Não informado",
                    )}
                  </p>
                  <p className="mt-2 text-sm text-[#607368]">
                    {String(obs.descricao || obs.observacao || "Sem descrição.")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="rounded-2xl border border-[#d8d6c9] bg-[#fbfaf5] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-[#245942]" />
          <h3 className="text-lg font-semibold text-[#13251d]">
            Acompanhamento por técnico
          </h3>
        </div>

        {resumoTecnicos.length === 0 ? (
          <p className="text-[#607368]">
            Nenhum técnico cadastrado ainda.
          </p>
        ) : (
          <div className="space-y-4">
            {resumoTecnicos.map((tecnico) => (
              <div
                key={tecnico.id}
                className="rounded-xl border border-[#ded9c8] bg-white p-4"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                  <div>
                    <p className="font-medium text-[#13251d]">
                      {tecnico.nome}
                    </p>
                    <p className="text-sm text-[#607368]">
                      {tecnico.email}
                    </p>
                  </div>

                  <div className="text-sm text-[#607368]">
                    Meta: 72 produtores
                  </div>
                </div>

                <div className="mb-3 h-3 w-full overflow-hidden rounded-full bg-[#e8e2d4]">
                  <div
                    className="h-full bg-[#e6c46a]"
                    style={{ width: `${tecnico.progresso}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                  <div className="rounded-lg bg-[#f4f0e7] p-3">
                    <p className="text-[#607368]">Produtores</p>
                    <p className="font-semibold text-[#13251d]">
                      {tecnico.produtoresDoTecnico}
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#f4f0e7] p-3">
                    <p className="text-[#607368]">Faltam</p>
                    <p className="font-semibold text-[#13251d]">
                      {tecnico.faltam}
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#f4f0e7] p-3">
                    <p className="text-[#607368]">Documentos</p>
                    <p className="font-semibold text-[#13251d]">
                      {tecnico.documentosDoTecnico}
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#f4f0e7] p-3">
                    <p className="text-[#607368]">Cronogramas</p>
                    <p className="font-semibold text-[#13251d]">
                      {tecnico.cronogramasDoTecnico}
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#f4f0e7] p-3">
                    <p className="text-[#607368]">Observações</p>
                    <p className="font-semibold text-[#13251d]">
                      {tecnico.observacoesDoTecnico}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[#d8d6c9] bg-[#fbfaf5] p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-[#13251d]">
          Últimos Produtores Cadastrados
        </h3>

        {produtores.length === 0 ? (
          <p className="text-[#607368]">
            Nenhum produtor cadastrado.
          </p>
        ) : (
          <div className="space-y-3">
            {[...produtores]
              .slice(-5)
              .reverse()
              .map((produtor) => (
                <div
                  key={produtor.id}
                  className="flex flex-col gap-2 rounded-xl border border-[#ded9c8] bg-white p-3 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-medium text-[#13251d]">
                      {produtor.nome}
                    </p>
                    <p className="text-sm text-[#607368]">
                      CPF: {produtor.cpf}
                    </p>
                  </div>

                  <div className="text-sm text-[#607368]">
                    Cadastrado por:{" "}
                    {produtor.cadastradoPorNome || "Não informado"}
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}

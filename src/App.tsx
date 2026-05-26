import { useState, useEffect, useRef, useMemo } from "react";
import {
  Leaf,
  FileText,
  LogOut,
  User as UserIcon,
  Calendar,
  ClipboardPenLine,
  Shield,
  ChevronDown,
  UserPlus,
  Settings,
  LayoutDashboard,
  History,
  FileBarChart,
  Menu,
  X,
  Truck,
} from "lucide-react";

import RecomendacoesTecnicas from "./app/components/RecomendacoesTecnicas";
import Login from "./app/components/Login";
import Atendimento from "./app/components/Atendimento";
import CadastroUsuario from "./app/components/CadastroUsuario";
import CadastroProdutor from "./app/components/CadastroProdutor";
import EmissaoDocumento from "./app/components/EmissaoDocumento";
import CronogramaSemanalMelhorado from "./app/components/CronogramaSemanalMelhorado";
import PainelAdmin from "./app/components/PainelAdmin";
import HistoricoTrimestre from "./app/components/HistoricoTrimestre";
import GerenciadorComunidades from "./app/components/GerenciadorComunidades";
import GerenciadorVeiculos from "./app/components/GerenciadorVeiculos";

type Tela = "login" | "sistema";

type Tab =
  | "painel"
  | "cadastro"
  | "emissao"
  | "cronograma"
  | "atendimento"
  | "recomendacoes"
  | "historico"
  | "relatorio"
  | "trimestre"
  | "veiculos"
  | "comunidades";

type TipoUsuario = "adm" | "tecnico";

interface UsuarioLogado {
  id: string;
  email: string;
  nome: string;
  tipo: TipoUsuario;
}

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
  municipio?: string;
  comunidade?: string;
  [key: string]: unknown;
}

type UnknownValue = unknown;

function mostrarValor(valor: UnknownValue) {
  if (valor === null || valor === undefined || valor === "") {
    return "Não informado";
  }

  if (Array.isArray(valor)) {
    if (valor.length === 0) return "Não informado";

    return valor
      .map((item) =>
        typeof item === "object"
          ? JSON.stringify(item, null, 2)
          : String(item),
      )
      .join(", ");
  }

  if (typeof valor === "object") {
    return JSON.stringify(valor, null, 2);
  }

  return String(valor);
}

function HistoricoTecnico({
  usuarioLogado,
}: {
  usuarioLogado: UsuarioLogado | null;
}) {
  const [produtores] = useState<Produtor[]>(() => {
    const stored = localStorage.getItem("produtores");
    return stored ? JSON.parse(stored) : [];
  });

  const produtoresPermitidos = useMemo(() => {
    if (!usuarioLogado) return [];

    if (usuarioLogado.tipo === "adm") {
      return produtores;
    }

    return produtores.filter(
      (produtor) => produtor.cadastradoPorId === usuarioLogado.id,
    );
  }, [produtores, usuarioLogado]);

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

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl p-6 shadow-lg text-white"
        style={{
          background: 'linear-gradient(135deg, #ffa000 0%, #ffb300 50%, #ffc107 100%)'
        }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-lg">
            <History className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Histórico de Produtores
            </h2>
            <p className="text-white/90 mt-1">
              {usuarioLogado?.tipo === "adm"
                ? "Administrador pode visualizar todos os produtores cadastrados."
                : "Aqui aparecem apenas os produtores cadastrados pelo técnico logado."}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Produtores disponíveis no histórico
        </h3>

        {produtoresPermitidos.length === 0 ? (
          <p className="text-muted-foreground">
            Nenhum produtor encontrado para este usuário.
          </p>
        ) : (
          <div className="space-y-4">
            {produtoresPermitidos.map((produtor) => (
              <div
                key={produtor.id}
                className="rounded-xl border-2 border-amber-200 p-4 space-y-4 bg-gradient-to-r from-amber-50 to-orange-50 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div>
                    <p className="text-foreground font-bold text-lg">
                      {produtor.nome || "Nome não informado"}
                    </p>
                    <p className="text-sm text-amber-700 font-medium">
                      CPF: {produtor.cpf || "Não informado"}
                    </p>
                  </div>

                  <div className="text-sm text-amber-600 md:text-right">
                    <p>Cadastrado por:</p>
                    <p className="text-amber-800 font-semibold">
                      {produtor.cadastradoPorNome || "Não informado"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-amber-800 mb-2">
                    Documentos disponíveis:
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {documentosDisponiveis(produtor).map((doc) => (
                      <span
                        key={doc}
                        className="px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm font-medium shadow-md"
                      >
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-white/60 border border-amber-200 p-3 shadow-sm">
                    <p className="text-amber-700 font-semibold">Nome</p>
                    <p className="text-foreground font-medium">
                      {produtor.nome || "Não informado"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white/60 border border-amber-200 p-3 shadow-sm">
                    <p className="text-amber-700 font-semibold">CPF</p>
                    <p className="text-foreground font-medium">
                      {produtor.cpf || "Não informado"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white/60 border border-amber-200 p-3 shadow-sm">
                    <p className="text-amber-700 font-semibold">Município</p>
                    <p className="text-foreground font-medium">
                      {produtor.municipio || "Não informado"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white/60 border border-amber-200 p-3 shadow-sm">
                    <p className="text-amber-700 font-semibold">Comunidade</p>
                    <p className="text-foreground font-medium">
                      {produtor.comunidade || "Não informado"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white/60 border border-amber-200 p-3 md:col-span-2 shadow-sm">
                    <p className="text-amber-700 font-semibold">Perfil</p>
                    <p className="text-foreground font-medium">
                      {mostrarValor(produtor.perfil)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white/60 border border-amber-200 p-3 md:col-span-2 shadow-sm">
                    <p className="text-amber-700 font-semibold">Atividades</p>
                    <p className="text-foreground font-medium">
                      {mostrarValor(produtor.atividades)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RelatorioGeralProdutor() {
  const [produtores] = useState<Produtor[]>(() => {
    const stored = localStorage.getItem("produtores");
    return stored ? JSON.parse(stored) : [];
  });
  const [atendimentos] = useState<Record<string, unknown>[]>(() => {
    const stored = localStorage.getItem("atendimentos");
    return stored ? JSON.parse(stored) : [];
  });
  const [observacoes] = useState<Record<string, unknown>[]>(() => {
    const stored = localStorage.getItem("recomendacoesTecnicas");
    return stored ? JSON.parse(stored) : [];
  });
  const [documentos] = useState<Record<string, unknown>[]>(() => {
    const stored = localStorage.getItem("historicoDocumentos");
    return stored ? JSON.parse(stored) : [];
  });
  const [produtorSelecionado, setProdutorSelecionado] =
    useState<Produtor | null>(null);

  const atendimentosDoProdutor = atendimentos.filter(
    (item) =>
      item.produtorId === produtorSelecionado?.id ||
      item.produtorCpf === produtorSelecionado?.cpf ||
      item.cpf === produtorSelecionado?.cpf ||
      item.produtorNome === produtorSelecionado?.nome,
  );

  const observacoesDoProdutor = observacoes.filter(
    (item) =>
      item.produtorId === produtorSelecionado?.id ||
      item.produtorCpf === produtorSelecionado?.cpf ||
      item.cpf === produtorSelecionado?.cpf ||
      item.produtorNome === produtorSelecionado?.nome,
  );

  const documentosDoProdutor = documentos.filter(
    (item) =>
      item.produtorId === produtorSelecionado?.id ||
      item.produtorCpf === produtorSelecionado?.cpf ||
      item.cpf === produtorSelecionado?.cpf ||
      item.produtorNome === produtorSelecionado?.nome,
  );

  const camposIgnorados = [
    "id",
    "senha",
    "password",
    "confirmarSenha",
  ];

  const camposCadastro = produtorSelecionado
    ? Object.entries(produtorSelecionado).filter(
        ([campo]) => !camposIgnorados.includes(campo),
      )
    : [];

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl p-6 shadow-lg text-white"
        style={{
          background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 50%, #42a5f5 100%)'
        }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-lg">
            <FileBarChart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Relatório Geral do Produtor
            </h2>
            <p className="text-white/90 mt-1">
              Área restrita ao administrador. Mostra dados de cadastro,
              atendimento, observações técnicas e documentos do produtor.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <label className="text-sm font-medium text-foreground">
          Selecione o produtor
        </label>

        <select
          className="w-full mt-2 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
          value={produtorSelecionado?.id || ""}
          onChange={(e) => {
            const produtor = produtores.find(
              (item) => item.id === e.target.value,
            );

            setProdutorSelecionado(produtor || null);
          }}
        >
          <option value="">Selecione...</option>

          {produtores.map((produtor) => (
            <option key={produtor.id} value={produtor.id}>
              {produtor.nome || "Nome não informado"} -{" "}
              {produtor.cpf || "CPF não informado"}
            </option>
          ))}
        </select>
      </div>

      {produtorSelecionado && (
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Resumo do Produtor
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
              <div className="rounded-lg bg-accent/40 p-3">
                <p className="text-muted-foreground">Nome</p>
                <p className="text-foreground font-medium">
                  {produtorSelecionado.nome || "Não informado"}
                </p>
              </div>

              <div className="rounded-lg bg-accent/40 p-3">
                <p className="text-muted-foreground">CPF</p>
                <p className="text-foreground font-medium">
                  {produtorSelecionado.cpf || "Não informado"}
                </p>
              </div>

              <div className="rounded-lg bg-accent/40 p-3">
                <p className="text-muted-foreground">Técnico</p>
                <p className="text-foreground font-medium">
                  {produtorSelecionado.cadastradoPorNome || "Não informado"}
                </p>
              </div>

              <div className="rounded-lg bg-accent/40 p-3">
                <p className="text-muted-foreground">Município</p>
                <p className="text-foreground font-medium">
                  {produtorSelecionado.municipio || "Não informado"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Informações do Cadastro
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {camposCadastro.map(([campo, valor]) => (
                <div
                  key={campo}
                  className="rounded-lg bg-accent/40 p-3"
                >
                  <p className="text-muted-foreground">{campo}</p>
                  <p className="text-foreground font-medium whitespace-pre-wrap break-words">
                    {mostrarValor(valor)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Atendimentos
            </h3>

            {atendimentosDoProdutor.length === 0 ? (
              <p className="text-muted-foreground">
                Nenhum atendimento registrado para este produtor.
              </p>
            ) : (
              <div className="space-y-3">
                {atendimentosDoProdutor.map((atendimento, index) => (
                  <div
                    key={String(atendimento.id ?? index)}
                    className="rounded-lg border border-border p-4"
                  >
                    {Object.entries(atendimento).map(([campo, valor]) => (
                      <p
                        key={campo}
                        className="text-sm text-foreground whitespace-pre-wrap break-words"
                      >
                        <strong>{campo}:</strong> {mostrarValor(valor)}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Observações Técnicas
            </h3>

            {observacoesDoProdutor.length === 0 ? (
              <p className="text-muted-foreground">
                Nenhuma observação técnica registrada para este produtor.
              </p>
            ) : (
              <div className="space-y-3">
                {observacoesDoProdutor.map((obs, index) => (
                  <div
                    key={String(obs.id ?? index)}
                    className="rounded-lg border border-border p-4"
                  >
                    <p className="font-medium text-foreground">
                      {String(obs.titulo ?? "Observação técnica")}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Técnico:{" "}
                      {String(
                        obs.tecnicoResponsavelNome ||
                          obs.tecnicoResponsavel ||
                          obs.criadoPorNome ||
                          "Não informado",
                      )}
                    </p>

                    <p className="text-sm text-foreground mt-2 whitespace-pre-wrap">
                      {String(
                        obs.descricao ||
                          obs.observacao ||
                          obs.texto ||
                          "Sem descrição.",
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Documentos Gerados
            </h3>

            {documentosDoProdutor.length === 0 ? (
              <p className="text-muted-foreground">
                Nenhum documento gerado para este produtor.
              </p>
            ) : (
              <div className="space-y-3">
                {documentosDoProdutor.map((doc, index) => (
                  <div
                    key={String(doc.id ?? index)}
                    className="rounded-lg border border-border p-4"
                  >
                    <p className="font-medium text-foreground">
                      {String(doc.tipoDocumento ?? "Documento")}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Gerado por: {String(doc.geradoPorNome ?? "Não informado")}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Data: {String(doc.dataGeracao ?? "Não informada")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const getInitialUsuarioLogado = (): UsuarioLogado | null => {
  const usuario = localStorage.getItem("usuarioLogado");
  if (!usuario) return null;

  const dados = JSON.parse(usuario);
  return {
    id: String(dados.id),
    nome: String(dados.nome),
    email: String(dados.email),
    tipo: (dados.tipo || "tecnico") as TipoUsuario,
  };
};

const getInitialTela = (): Tela => {
  return localStorage.getItem("usuarioLogado") ? "sistema" : "login";
};

const getInitialActiveTab = (): Tab => {
  const usuario = localStorage.getItem("usuarioLogado");
  if (!usuario) return "cadastro";

  const dados = JSON.parse(usuario);
  return (dados.tipo || "tecnico") === "adm" ? "painel" : "cadastro";
};

export default function App() {
  const [telaAtual, setTelaAtual] = useState<Tela>(getInitialTela);
  const [activeTab, setActiveTab] = useState<Tab>(getInitialActiveTab);
  const [usuarioLogado, setUsuarioLogado] =
    useState<UsuarioLogado | null>(getInitialUsuarioLogado);

  const [menuPerfilAberto, setMenuPerfilAberto] = useState(false);
  const [modalNovoUsuario, setModalNovoUsuario] = useState(false);
  const [modalMeuPerfil, setModalMeuPerfil] = useState(false);
  const [sidebarAberto, setSidebarAberto] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    type UsuarioSalvo = {
      email?: string;
    };

    const usuariosSalvos = JSON.parse(
      localStorage.getItem("usuarios") || "[]",
    ) as UsuarioSalvo[];

    const existeAdm = usuariosSalvos.some(
      (u) => u.email === "brunoguilherme@gmail.com",
    );

    if (!existeAdm) {
      const admPadrao = {
        id: "1",
        nome: "adm1",
        email: "brunoguilherme@gmail.com",
        senha: "adm123",
        tipo: "adm",
        dataCadastro: new Date().toISOString(),
      };

      localStorage.setItem(
        "usuarios",
        JSON.stringify([admPadrao, ...usuariosSalvos]),
      );
    }
  }, []);

  useEffect(() => {
    const handleClickFora = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuPerfilAberto(false);
      }
    };

    document.addEventListener("mousedown", handleClickFora);

    return () => {
      document.removeEventListener("mousedown", handleClickFora);
    };
  }, []);

  const handleLogin = (
    email: string,
    senha: string,
    usuarioRecebido?: {
      id: string;
      nome: string;
      email: string;
      tipo: TipoUsuario;
    },
  ) => {
    if (usuarioRecebido) {
      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify({
          ...usuarioRecebido,
          loginTime: new Date().toISOString(),
        }),
      );

      setUsuarioLogado(usuarioRecebido);
      setTelaAtual("sistema");
      setActiveTab(usuarioRecebido.tipo === "adm" ? "painel" : "cadastro");
      return;
    }

    type UsuarioSalvoLogin = {
      id?: string;
      nome?: string;
      email?: string;
      senha?: string;
      tipo?: string;
    };

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]") as UsuarioSalvoLogin[];

    const usuario = usuarios.find(
      (u) => u.email === email && u.senha === senha,
    );

    if (usuario) {
      const dadosUsuario: UsuarioLogado = {
        id: usuario.id || "",
        email: usuario.email || "",
        nome: usuario.nome || "",
        tipo: (usuario.tipo || "tecnico") as TipoUsuario,
      };

      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify({
          ...dadosUsuario,
          loginTime: new Date().toISOString(),
        }),
      );

      setUsuarioLogado(dadosUsuario);
      setTelaAtual("sistema");
      setActiveTab(dadosUsuario.tipo === "adm" ? "painel" : "cadastro");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    setUsuarioLogado(null);
    setTelaAtual("login");
    setActiveTab("cadastro");
    setMenuPerfilAberto(false);
  };

  const atualizarUsuarioLogado = () => {
    const usuario = localStorage.getItem("usuarioLogado");

    if (usuario) {
      const dados = JSON.parse(usuario);

      setUsuarioLogado({
        id: dados.id,
        nome: dados.nome,
        email: dados.email,
        tipo: (dados.tipo || "tecnico") as TipoUsuario,
      });
    }
  };

  const isAdm = usuarioLogado?.tipo === "adm";
  const menuLinks = [
    {
      key: "painel" as const,
      label: "Painel Administrativo",
      icon: LayoutDashboard,
      activeClasses: "border-purple-500 text-purple-700 bg-purple-50",
      inactiveClasses: "border-transparent text-muted-foreground hover:text-purple-600 hover:bg-purple-50/50",
      visible: isAdm,
    },
    {
      key: "relatorio" as const,
      label: "Relatório Geral",
      icon: FileBarChart,
      activeClasses: "border-blue-500 text-blue-700 bg-blue-50",
      inactiveClasses: "border-transparent text-muted-foreground hover:text-blue-600 hover:bg-blue-50/50",
      visible: isAdm,
    },
    {
      key: "atendimento" as const,
      label: "Atendimento",
      icon: UserIcon,
      activeClasses: "border-teal-500 text-teal-700 bg-teal-50",
      inactiveClasses: "border-transparent text-muted-foreground hover:text-teal-600 hover:bg-teal-50/50",
      visible: true,
    },
    {
      key: "cadastro" as const,
      label: "Cadastro de Produtor",
      icon: UserPlus,
      activeClasses: "border-primary text-primary bg-green-50",
      inactiveClasses: "border-transparent text-muted-foreground hover:text-primary hover:bg-green-50/50",
      visible: true,
    },
    {
      key: "veiculos" as const,
      label: "Veículos",
      icon: Truck,
      activeClasses: "border-emerald-500 text-emerald-700 bg-emerald-50",
      inactiveClasses: "border-transparent text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50/50",
      visible: true,
    },
    {
      key: "historico" as const,
      label: "Histórico",
      icon: History,
      activeClasses: "border-amber-500 text-amber-700 bg-amber-50",
      inactiveClasses: "border-transparent text-muted-foreground hover:text-amber-600 hover:bg-amber-50/50",
      visible: true,
    },
    {
      key: "trimestre" as const,
      label: "Histórico por Trimestre",
      icon: Calendar,
      activeClasses: "border-purple-500 text-purple-700 bg-purple-50",
      inactiveClasses: "border-transparent text-muted-foreground hover:text-purple-600 hover:bg-purple-50/50",
      visible: true,
    },
    {
      key: "recomendacoes" as const,
      label: "Recomendações Técnicas",
      icon: ClipboardPenLine,
      activeClasses: "border-indigo-500 text-indigo-700 bg-indigo-50",
      inactiveClasses: "border-transparent text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50/50",
      visible: true,
    },
    {
      key: "emissao" as const,
      label: "Emissão de Documentos",
      icon: FileText,
      activeClasses: "border-orange-500 text-orange-700 bg-orange-50",
      inactiveClasses: "border-transparent text-muted-foreground hover:text-orange-600 hover:bg-orange-50/50",
      visible: true,
    },
    {
      key: "cronograma" as const,
      label: "Cronograma de Visitas",
      icon: Calendar,
      activeClasses: "border-pink-500 text-pink-700 bg-pink-50",
      inactiveClasses: "border-transparent text-muted-foreground hover:text-pink-600 hover:bg-pink-50/50",
      visible: true,
    },
  ];

  const isTecnico = usuarioLogado?.tipo === "tecnico";
  const podeUsarSistema = isAdm || isTecnico;

  if (telaAtual === "login") {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative lg:ml-72">
        <header
          className="text-white shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #2d6a3e 0%, #43a047 50%, #66bb6a 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarAberto(true)}
                className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20 lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-lg shadow-lg">
                <Leaf className="w-7 h-7 text-white" />
              </div>

              <div>
                <h1 className="text-white font-semibold tracking-wide">
                  Sistema de Cadastro de Produtor Rural
                </h1>
                <p className="text-white/90 mt-0.5">
                  Gestão Agrícola e Emissão de Documentos
                </p>
              </div>
            </div>

            <div className="relative hidden sm:block" ref={menuRef}>
              <button
                onClick={() => setMenuPerfilAberto(!menuPerfilAberto)}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg transition-all shadow-lg"
              >
                <div className="bg-white/20 p-1.5 rounded-full">
                  <UserIcon className="w-5 h-5" />
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium flex items-center justify-end gap-2">
                    {usuarioLogado?.nome}
                    {isAdm && <Shield className="w-4 h-4 text-amber-300" />}
                  </p>

                  <p className="text-xs text-white/80">
                    {usuarioLogado?.email}
                  </p>

                  <p className="text-xs text-white/80 uppercase">
                    {isAdm ? "Administrador" : "Técnico"}
                  </p>
                </div>

                <ChevronDown className="w-4 h-4" />
              </button>

              {menuPerfilAberto && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <button
                    onClick={() => {
                      setModalMeuPerfil(true);
                      setMenuPerfilAberto(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all"
                  >
                    <div className="bg-blue-100 p-1.5 rounded-lg">
                      <Settings className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>Meu Perfil</span>
                  </button>

                  {isAdm && (
                    <button
                      onClick={() => {
                        setModalNovoUsuario(true);
                        setMenuPerfilAberto(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all"
                    >
                      <div className="bg-purple-100 p-1.5 rounded-lg">
                        <UserPlus className="w-4 h-4 text-purple-600" />
                      </div>
                      <span>Novo Usuário</span>
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-all"
                  >
                    <div className="bg-red-100 p-1.5 rounded-lg">
                      <LogOut className="w-4 h-4 text-red-600" />
                    </div>
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto border-r border-border bg-card p-5 shadow-xl transition-transform duration-300 lg:translate-x-0 ${
            sidebarAberto ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-semibold">
                Navegação
              </p>
              <h2 className="text-lg font-semibold text-foreground">
                Menu
              </h2>
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground transition hover:bg-slate-100 lg:hidden"
              onClick={() => setSidebarAberto(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-6 space-y-2">
            {menuLinks
              .filter((item) => item.visible)
              .map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.key);
                      setSidebarAberto(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                      activeTab === item.key
                        ? item.activeClasses
                        : item.inactiveClasses
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
          </nav>

          <div className="mt-6 pt-6 border-t border-border">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </aside>

        {sidebarAberto && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setSidebarAberto(false)}
          />
        )}

        <div className="lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {isAdm && activeTab === "painel" && <PainelAdmin />}

        {isAdm && activeTab === "relatorio" && (
          <RelatorioGeralProdutor />
        )}

        {podeUsarSistema && activeTab === "atendimento" && <Atendimento />}

        {podeUsarSistema && activeTab === "cadastro" && <CadastroProdutor />}

        {podeUsarSistema && activeTab === "veiculos" && (
          <GerenciadorVeiculos usuarioLogado={usuarioLogado} />
        )}

        {podeUsarSistema && activeTab === "historico" && (
          <HistoricoTecnico usuarioLogado={usuarioLogado} />
        )}

        {podeUsarSistema && activeTab === "trimestre" && <HistoricoTrimestre />}

        {isAdm && activeTab === "comunidades" && <GerenciadorComunidades />}

        {podeUsarSistema && activeTab === "emissao" && <EmissaoDocumento />}

        {podeUsarSistema && activeTab === "cronograma" && <CronogramaSemanalMelhorado />}

        {podeUsarSistema && activeTab === "recomendacoes" && (
          <RecomendacoesTecnicas />
        )}
          </div>
        </div>
      </div>

      {modalNovoUsuario && isAdm && (
        <CadastroUsuario
          onClose={() => setModalNovoUsuario(false)}
          onSalvar={atualizarUsuarioLogado}
          permitirEscolherTipo={true}
        />
      )}

      {modalMeuPerfil && usuarioLogado && (
        <CadastroUsuario
          onClose={() => {
            setModalMeuPerfil(false);
            atualizarUsuarioLogado();
          }}
          onSalvar={atualizarUsuarioLogado}
          usuarioEdicao={usuarioLogado}
          permitirEscolherTipo={isAdm}
        />
      )}
    </div>
  );
}
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar,
  ChevronDown,
  ClipboardPenLine,
  FileBarChart,
  FileText,
  History,
  LayoutDashboard,
  Leaf,
  Loader2,
  LogOut,
  Menu,
  Settings,
  Shield,
  Truck,
  User as UserIcon,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

const Login = lazy(() => import("./pages/LoginPage"));
const RecomendacoesTecnicas = lazy(
  () => import("./pages/RecomendacoesTecnicasPage"),
);
const Atendimento = lazy(() => import("./pages/AtendimentoPage"));
const CadastroUsuario = lazy(() => import("./components/CadastroUsuario"));
const CadastroProdutor = lazy(() => import("./pages/CadastroProdutorPage"));
const EmissaoDocumento = lazy(() => import("./pages/EmissaoDocumentoPage"));
const CronogramaSemanalMelhorado = lazy(() => import("./pages/CronogramaPage"));
const PainelAdmin = lazy(() => import("./pages/PainelAdminPage"));
const HistoricoTrimestre = lazy(() => import("./pages/HistoricoTrimestrePage"));
const GerenciadorComunidades = lazy(
  () => import("./pages/GerenciadorComunidadesPage"),
);
const GerenciadorVeiculos = lazy(
  () => import("./pages/GerenciadorVeiculosPage"),
);
const RelatorioGeralProdutor = lazy(
  () => import("./pages/RelatorioGeralProdutorPage"),
);
const HistoricoTecnico = lazy(() => import("./pages/HistoricoTecnico"));

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

const rotasTecnico: Tab[] = [
  "cadastro",
  "atendimento",
  "veiculos",
  "historico",
  "trimestre",
  "recomendacoes",
  "emissao",
  "cronograma",
];

const rotasAdmin: Tab[] = [
  "painel",
  "relatorio",
  "comunidades",
  ...rotasTecnico,
];

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

function getHomePath(usuario: UsuarioLogado | null) {
  if (!usuario) return "/login";
  return usuario.tipo === "adm" ? "/app/painel" : "/app/cadastro";
}

function LoadingRoute() {
  return (
    <div className="flex min-h-[280px] items-center justify-center text-[#607368]">
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      Carregando...
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuarioLogado, setUsuarioLogado] =
    useState<UsuarioLogado | null>(getInitialUsuarioLogado);
  const [menuPerfilAberto, setMenuPerfilAberto] = useState(false);
  const [modalNovoUsuario, setModalNovoUsuario] = useState(false);
  const [modalMeuPerfil, setModalMeuPerfil] = useState(false);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAdm = usuarioLogado?.tipo === "adm";
  const rotasPermitidas = isAdm ? rotasAdmin : rotasTecnico;
  const activeTab = useMemo(() => {
    const tab = location.pathname.split("/")[2] as Tab | undefined;
    return tab && rotasPermitidas.includes(tab) ? tab : undefined;
  }, [location.pathname, rotasPermitidas]);

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
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuPerfilAberto(false);
      }
    };

    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

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

  const handleLogin = (
    email: string,
    senha: string,
    usuarioRecebido?: UsuarioLogado,
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
      navigate(getHomePath(usuarioRecebido), { replace: true });
      return;
    }

    type UsuarioSalvoLogin = {
      id?: string;
      nome?: string;
      email?: string;
      senha?: string;
      tipo?: string;
    };

    const usuarios = JSON.parse(
      localStorage.getItem("usuarios") || "[]",
    ) as UsuarioSalvoLogin[];

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
      navigate(getHomePath(dadosUsuario), { replace: true });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    setUsuarioLogado(null);
    setMenuPerfilAberto(false);
    setMenuMobileAberto(false);
    navigate("/login", { replace: true });
  };

  const menuLinks = [
    {
      key: "painel" as const,
      label: "Painel Administrativo",
      icon: LayoutDashboard,
      visible: isAdm,
    },
    {
      key: "relatorio" as const,
      label: "Relatório Geral",
      icon: FileBarChart,
      visible: isAdm,
    },
    {
      key: "comunidades" as const,
      label: "Comunidades",
      icon: Users,
      visible: isAdm,
    },
    {
      key: "atendimento" as const,
      label: "Atendimento",
      icon: UserIcon,
      visible: true,
    },
    {
      key: "cadastro" as const,
      label: "Cadastro de Produtor",
      icon: UserPlus,
      visible: true,
    },
    {
      key: "veiculos" as const,
      label: "Veículos",
      icon: Truck,
      visible: true,
    },
    {
      key: "historico" as const,
      label: "Histórico",
      icon: History,
      visible: true,
    },
    {
      key: "trimestre" as const,
      label: "Histórico por Trimestre",
      icon: Calendar,
      visible: true,
    },
    {
      key: "recomendacoes" as const,
      label: "Recomendações Técnicas",
      icon: ClipboardPenLine,
      visible: true,
    },
    {
      key: "emissao" as const,
      label: "Emissão de Documentos",
      icon: FileText,
      visible: true,
    },
    {
      key: "cronograma" as const,
      label: "Cronograma de Visitas",
      icon: Calendar,
      visible: true,
    },
  ];

  const visibleMenuLinks = menuLinks.filter((item) => item.visible);
  const activeMenuItem = menuLinks.find((item) => item.key === activeTab);
  const ActiveIcon = activeMenuItem?.icon || Leaf;

  if (!usuarioLogado) {
    return (
      <Suspense fallback={<LoadingRoute />}>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f0e7] text-[#13251d]">
      <header className="sticky top-0 z-30 min-w-0 border-b border-white/10 bg-[#173f31] text-white shadow-xl shadow-[#173f31]/15">
        <div className="bg-[linear-gradient(90deg,rgba(230,169,51,0.95),rgba(230,169,51,0)_34%),linear-gradient(135deg,#173f31_0%,#245942_58%,#173f31_100%)]">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:gap-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMenuMobileAberto(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white transition hover:bg-white/15 lg:hidden"
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white text-[#173f31] shadow-sm">
                <Leaf className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e6c46a]">
                  IDAM Rural
                </p>
                <h1 className="truncate text-base font-semibold leading-tight sm:text-xl">
                  {activeMenuItem?.label || "Sistema de Cadastro Rural"}
                </h1>
                <p className="mt-0.5 hidden text-sm text-white/68 md:block">
                  Operação de campo, cadastro produtivo e emissão documental
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/85 md:flex">
                <ActiveIcon className="h-4 w-4 text-[#e6c46a]" />
                <span className="font-medium">{activeMenuItem?.label}</span>
              </div>

              <div className="relative hidden sm:block" ref={menuRef}>
                <button
                  onClick={() => setMenuPerfilAberto(!menuPerfilAberto)}
                  className="flex items-center gap-3 rounded-md border border-white/15 bg-white/95 px-3 py-2 text-[#173f31] shadow-sm transition hover:bg-white"
                  aria-expanded={menuPerfilAberto}
                >
                  <div className="rounded-md bg-[#e8f1dc] p-1.5 text-[#245942]">
                    <UserIcon className="h-5 w-5" />
                  </div>

                  <div className="text-right">
                    <p className="flex items-center justify-end gap-2 text-sm font-semibold">
                      {usuarioLogado.nome}
                      {isAdm && <Shield className="h-4 w-4 text-[#c89222]" />}
                    </p>
                    <p className="max-w-40 truncate text-xs text-[#607368] lg:max-w-48">
                      {usuarioLogado.email}
                    </p>
                  </div>

                  <ChevronDown className="h-4 w-4" />
                </button>

                {menuPerfilAberto && (
                  <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border border-[#d8d6c9] bg-white shadow-2xl">
                    <button
                      onClick={() => {
                        setModalMeuPerfil(true);
                        setMenuPerfilAberto(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-[#263a31] transition hover:bg-[#f4f0e7]"
                    >
                      <div className="rounded-md bg-[#e8f1dc] p-1.5">
                        <Settings className="h-4 w-4 text-[#245942]" />
                      </div>
                      <span>Meu Perfil</span>
                    </button>

                    {isAdm && (
                      <button
                        onClick={() => {
                          setModalNovoUsuario(true);
                          setMenuPerfilAberto(false);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-[#263a31] transition hover:bg-[#f4f0e7]"
                      >
                        <div className="rounded-md bg-[#e8f1dc] p-1.5">
                          <UserPlus className="h-4 w-4 text-[#245942]" />
                        </div>
                        <span>Novo Usuário</span>
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-700 transition hover:bg-red-50"
                    >
                      <div className="rounded-md bg-red-100 p-1.5">
                        <LogOut className="h-4 w-4 text-red-700" />
                      </div>
                      <span>Sair</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <nav className="border-t border-white/10 bg-[#123429]/80">
            <div className="hide-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
              {visibleMenuLinks.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => navigate(`/app/${item.key}`)}
                    className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#e6c46a] text-[#173f31] shadow-sm"
                        : "text-white/78 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </header>

      {menuMobileAberto && (
        <div className="fixed inset-0 z-40 bg-[#13251d]/55 p-3 backdrop-blur-sm lg:hidden">
          <div className="mx-auto max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-[#173f31] px-4 py-4 text-white">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e6c46a]">
                  Navegação
                </p>
                <p className="font-semibold">IDAM Rural</p>
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 bg-white/10"
                onClick={() => setMenuMobileAberto(false)}
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="hide-scrollbar max-h-[calc(100vh-9rem)] space-y-1 overflow-y-auto p-3">
              {visibleMenuLinks.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      navigate(`/app/${item.key}`);
                      setMenuMobileAberto(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#e6c46a] text-[#173f31]"
                        : "text-[#263a31] hover:bg-[#f4f0e7]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
              >
                <LogOut className="h-5 w-5" />
                Sair
              </button>
            </nav>
          </div>
        </div>
      )}

      <main className="app-content mx-auto min-w-0 max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="mb-6 overflow-hidden rounded-2xl border border-[#d8d6c9] bg-[#fbfaf5] shadow-sm">
          <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#173f31] text-white sm:h-12 sm:w-12">
                <ActiveIcon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9b741d]">
                  Área de trabalho
                </p>
                <h2 className="mt-1 break-words text-xl font-semibold text-[#13251d] sm:text-2xl">
                  {activeMenuItem?.label || "Sistema de Cadastro Rural"}
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-[#607368]">
                  Fluxo organizado para atendimento, acompanhamento técnico e documentação rural.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 text-center min-[420px]:grid-cols-3">
              {["Cadastro", "Campo", "Documento"].map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-[#ded9c8] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#466255]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Suspense fallback={<LoadingRoute />}>
          <Routes>
            <Route
              path="/"
              element={<Navigate to={getHomePath(usuarioLogado)} replace />}
            />
            <Route
              path="/login"
              element={<Navigate to={getHomePath(usuarioLogado)} replace />}
            />
            <Route
              path="/app"
              element={<Navigate to={getHomePath(usuarioLogado)} replace />}
            />
            <Route
              path="/app/painel"
              element={
                isAdm ? <PainelAdmin /> : <Navigate to="/app/cadastro" replace />
              }
            />
            <Route
              path="/app/relatorio"
              element={
                isAdm ? (
                  <RelatorioGeralProdutor />
                ) : (
                  <Navigate to="/app/cadastro" replace />
                )
              }
            />
            <Route
              path="/app/comunidades"
              element={
                isAdm ? (
                  <GerenciadorComunidades />
                ) : (
                  <Navigate to="/app/cadastro" replace />
                )
              }
            />
            <Route path="/app/atendimento" element={<Atendimento />} />
            <Route path="/app/cadastro" element={<CadastroProdutor />} />
            <Route
              path="/app/veiculos"
              element={<GerenciadorVeiculos usuarioLogado={usuarioLogado} />}
            />
            <Route
              path="/app/historico"
              element={<HistoricoTecnico usuarioLogado={usuarioLogado} />}
            />
            <Route path="/app/trimestre" element={<HistoricoTrimestre />} />
            <Route path="/app/emissao" element={<EmissaoDocumento />} />
            <Route
              path="/app/cronograma"
              element={<CronogramaSemanalMelhorado />}
            />
            <Route
              path="/app/recomendacoes"
              element={<RecomendacoesTecnicas />}
            />
            <Route
              path="*"
              element={<Navigate to={getHomePath(usuarioLogado)} replace />}
            />
          </Routes>
        </Suspense>
      </main>

      <Suspense fallback={null}>
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
      </Suspense>
    </div>
  );
}

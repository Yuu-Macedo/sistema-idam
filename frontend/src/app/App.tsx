import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { AppFooter } from "./components/layout/AppFooter";
import { AppHeader } from "./components/layout/AppHeader";
import { AppSidebar } from "./components/layout/AppSidebar";
import { LoadingRoute } from "./components/layout/LoadingRoute";
import { MobileMenu } from "./components/layout/MobileMenu";
import { WorkspaceBanner } from "./components/layout/WorkspaceBanner";
import { getMenuLinks, rotasAdmin, rotasTecnico } from "./navigation";
import type { Tab, TipoUsuario, UsuarioLogado } from "./types";

const Login = lazy(() => import("./pages/LoginPage"));
const CadastroUsuario = lazy(() => import("./components/CadastroUsuario"));

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

  const menuLinks = getMenuLinks(isAdm);
  const visibleMenuLinks = menuLinks.filter((item) => item.visible);
  const activeMenuItem = menuLinks.find((item) => item.key === activeTab);
  const homePath = getHomePath(usuarioLogado);
  const navigateToTab = (tab: Tab) => navigate(`/app/${tab}`);

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
      <AppHeader
        activeMenuItem={activeMenuItem}
        isAdm={isAdm}
        menuPerfilAberto={menuPerfilAberto}
        menuRef={menuRef}
        usuarioLogado={usuarioLogado}
        onLogout={handleLogout}
        onOpenMeuPerfil={() => {
          setModalMeuPerfil(true);
          setMenuPerfilAberto(false);
        }}
        onOpenMobileMenu={() => setMenuMobileAberto(true)}
        onOpenNovoUsuario={() => {
          setModalNovoUsuario(true);
          setMenuPerfilAberto(false);
        }}
        onTogglePerfil={() => setMenuPerfilAberto(!menuPerfilAberto)}
      />

      <MobileMenu
        aberto={menuMobileAberto}
        activeTab={activeTab}
        visibleMenuLinks={visibleMenuLinks}
        onClose={() => setMenuMobileAberto(false)}
        onLogout={handleLogout}
        onNavigate={navigateToTab}
      />

      <div className="flex min-w-0 gap-5 lg:items-start">
        <AppSidebar
          activeTab={activeTab}
          visibleMenuLinks={visibleMenuLinks}
          onNavigate={navigateToTab}
        />

        <main className="app-content min-w-0 flex-1 px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <WorkspaceBanner activeMenuItem={activeMenuItem} />

          <AppRoutes
            homePath={homePath}
            isAdm={isAdm}
            usuarioLogado={usuarioLogado}
          />
        </main>
      </div>

      <AppFooter />

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

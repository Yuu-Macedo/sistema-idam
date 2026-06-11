import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { toast } from "sonner";
import { LoadingRoute } from "../components/layout/LoadingRoute";
import { AppShell } from "./layout/AppShell";
import {
  getMenuGroups,
  getMenuLinks,
  rotasAdmin,
  rotasTecnico,
} from "./routes/navigation";
import type { Tab, UsuarioLogado } from "../types/app";
import {
  clearUsuarioLogado,
  getUsuarioLogado,
} from "../services/authStorage";
import { loginWithApi, logoutWithApi } from "../services/authApi";
import { SESSION_EXPIRED_EVENT } from "../services/apiClient";
import { fetchProdutoresApi } from "../services/produtoresApi";
import { syncApiResourcesToLocalStorage } from "../services/resourcesApi";
import { writeResourceSnapshot } from "../services/localCache";
import { flushSyncQueue, getSyncQueue } from "../services/syncQueue";

const Login = lazy(() => import("../pages/Auth/LoginPage"));

function getHomePath(usuario: UsuarioLogado | null) {
  if (!usuario) return "/login";
  return usuario.tipo === "adm" ? "/app/painel" : "/app/cadastro";
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuarioLogado, setUsuarioLogado] =
    useState<UsuarioLogado | null>(getUsuarioLogado);
  const [menuPerfilAberto, setMenuPerfilAberto] = useState(false);
  const [modalNovoUsuario, setModalNovoUsuario] = useState(false);
  const [modalMeuPerfil, setModalMeuPerfil] = useState(false);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [sidebarRecolhida, setSidebarRecolhida] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAdm = usuarioLogado?.tipo === "adm";
  const rotasPermitidas = isAdm ? rotasAdmin : rotasTecnico;
  const activeTab = useMemo(() => {
    const tab = location.pathname.split("/")[2] as Tab | undefined;
    return tab && rotasPermitidas.includes(tab) ? tab : undefined;
  }, [location.pathname, rotasPermitidas]);

  useEffect(() => {
    if (!usuarioLogado) return;

    flushSyncQueue()
      .then(({ flushed, pending }) => {
        if (flushed) {
          toast.success(`${flushed} operacao pendente sincronizada.`);
        }
        if (pending) {
          toast.warning(`${pending} operacao continua pendente de sincronizacao.`);
        }
      })
      .catch(() => {
        const pending = getSyncQueue().length;
        if (pending) {
          toast.warning(`${pending} operacao pendente sera reenviada depois.`);
        }
      });

    fetchProdutoresApi()
      .then((produtores) => {
        writeResourceSnapshot({ produtores });
      })
      .catch((error) => {
        console.warn("Não foi possível sincronizar produtores com a API.", error);
      });

    syncApiResourcesToLocalStorage().catch((error) => {
      console.warn("Não foi possível sincronizar recursos extras com a API.", error);
    });
  }, [usuarioLogado]);

  useEffect(() => {
    const handleSessionExpired = () => {
      clearUsuarioLogado();
      setUsuarioLogado(null);
      toast.error("Sua sessao expirou. Entre novamente.");
      navigate("/login", { replace: true });
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
  }, [navigate]);

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
    setUsuarioLogado(getUsuarioLogado());
  };

  const handleLogin = async (
    email: string,
    senha: string,
  ) => {
    try {
      const usuarioApi = await loginWithApi(email, senha);
      setUsuarioLogado(usuarioApi);
      navigate(getHomePath(usuarioApi), { replace: true });
      return;
    } catch (error) {
      console.warn("Login via API indisponível, tentando login local.", error);
    }

    throw new Error(
      "Nao foi possivel entrar. Verifique se a API esta online e se o email/senha estao corretos.",
    );
  };

  const handleLogout = async () => {
    try {
      await logoutWithApi();
    } catch (error) {
      console.warn("Logout via API não concluído.", error);
    }

    clearUsuarioLogado();
    setUsuarioLogado(null);
    setMenuPerfilAberto(false);
    setMenuMobileAberto(false);
    navigate("/login", { replace: true });
  };

  const menuLinks = getMenuLinks(isAdm);
  const menuGroups = getMenuGroups(isAdm);
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
    <AppShell
      activeMenuItem={activeMenuItem}
      activeTab={activeTab}
      homePath={homePath}
      isAdm={isAdm}
      menuMobileAberto={menuMobileAberto}
      menuPerfilAberto={menuPerfilAberto}
      menuRef={menuRef}
      modalMeuPerfil={modalMeuPerfil}
      modalNovoUsuario={modalNovoUsuario}
      sidebarRecolhida={sidebarRecolhida}
      usuarioLogado={usuarioLogado}
      menuGroups={menuGroups}
      visibleMenuLinks={visibleMenuLinks}
      onAtualizarUsuarioLogado={atualizarUsuarioLogado}
      onCloseMeuPerfil={() => {
        setModalMeuPerfil(false);
        atualizarUsuarioLogado();
      }}
      onCloseMobileMenu={() => setMenuMobileAberto(false)}
      onCloseNovoUsuario={() => setModalNovoUsuario(false)}
      onLogout={handleLogout}
      onNavigate={navigateToTab}
      onOpenMeuPerfil={() => {
        setModalMeuPerfil(true);
        setMenuPerfilAberto(false);
      }}
      onOpenMobileMenu={() => setMenuMobileAberto(true)}
      onOpenNovoUsuario={() => {
        setModalNovoUsuario(true);
        setMenuPerfilAberto(false);
      }}
      onToggleSidebar={() => setSidebarRecolhida((atual) => !atual)}
      onTogglePerfil={() => setMenuPerfilAberto(!menuPerfilAberto)}
    />
  );
}

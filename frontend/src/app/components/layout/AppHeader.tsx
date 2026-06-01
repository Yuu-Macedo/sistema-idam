import type { RefObject } from "react";
import {
  ChevronDown,
  Leaf,
  LogOut,
  Menu,
  Settings,
  Shield,
  User as UserIcon,
  UserPlus,
} from "lucide-react";
import type { MenuLink, UsuarioLogado } from "../../types";

interface AppHeaderProps {
  activeMenuItem?: MenuLink;
  isAdm: boolean;
  menuPerfilAberto: boolean;
  menuRef: RefObject<HTMLDivElement | null>;
  usuarioLogado: UsuarioLogado;
  onLogout: () => void;
  onOpenMeuPerfil: () => void;
  onOpenMobileMenu: () => void;
  onOpenNovoUsuario: () => void;
  onTogglePerfil: () => void;
}

export function AppHeader({
  activeMenuItem,
  isAdm,
  menuPerfilAberto,
  menuRef,
  usuarioLogado,
  onLogout,
  onOpenMeuPerfil,
  onOpenMobileMenu,
  onOpenNovoUsuario,
  onTogglePerfil,
}: AppHeaderProps) {
  const ActiveIcon = activeMenuItem?.icon || Leaf;

  return (
    <header className="sticky top-0 z-30 min-w-0 border-b border-white/10 bg-[#173f31] text-white shadow-xl shadow-[#173f31]/15">
      <div className="bg-[#173f31]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:gap-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onOpenMobileMenu}
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
                IDAM
              </p>
              <h1 className="truncate text-base font-semibold leading-tight sm:text-xl">
                {activeMenuItem?.label || "Sistema de Cadastro Rural"}
              </h1>
              <p className="mt-0.5 hidden text-sm text-white/68 md:block">
                Instituto de Desenvolvimento Agropecuário e Florestal
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
                onClick={onTogglePerfil}
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
                    onClick={onOpenMeuPerfil}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-[#263a31] transition hover:bg-[#f4f0e7]"
                  >
                    <div className="rounded-md bg-[#e8f1dc] p-1.5">
                      <Settings className="h-4 w-4 text-[#245942]" />
                    </div>
                    <span>Meu Perfil</span>
                  </button>

                  {isAdm && (
                    <button
                      onClick={onOpenNovoUsuario}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-[#263a31] transition hover:bg-[#f4f0e7]"
                    >
                      <div className="rounded-md bg-[#e8f1dc] p-1.5">
                        <UserPlus className="h-4 w-4 text-[#245942]" />
                      </div>
                      <span>Novo Usuário</span>
                    </button>
                  )}

                  <button
                    onClick={onLogout}
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

      </div>
    </header>
  );
}

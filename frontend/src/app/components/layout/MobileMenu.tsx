import { LogOut, X } from "lucide-react";
import type { MenuLink, Tab } from "../../types";

interface MobileMenuProps {
  activeTab?: Tab;
  aberto: boolean;
  visibleMenuLinks: MenuLink[];
  onClose: () => void;
  onLogout: () => void;
  onNavigate: (tab: Tab) => void;
}

export function MobileMenu({
  activeTab,
  aberto,
  visibleMenuLinks,
  onClose,
  onLogout,
  onNavigate,
}: MobileMenuProps) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-40 bg-[#13251d]/55 backdrop-blur-sm lg:hidden">
      <div className="h-full w-[min(22rem,calc(100vw-2rem))] overflow-hidden bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-[#173f31] px-4 py-4 text-white">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e6c46a]">
              Navegação
            </p>
            <p className="font-semibold">IDAM</p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 bg-white/10"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="hide-scrollbar h-[calc(100vh-8rem)] space-y-1 overflow-y-auto p-3">
          {visibleMenuLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  onNavigate(item.key);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#173f31] text-white"
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
            onClick={onLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </nav>
      </div>
    </div>
  );
}

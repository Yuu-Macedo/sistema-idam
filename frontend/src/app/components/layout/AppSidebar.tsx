import type { MenuLink, Tab } from "../../types";

interface AppSidebarProps {
  activeTab?: Tab;
  visibleMenuLinks: MenuLink[];
  onNavigate: (tab: Tab) => void;
}

export function AppSidebar({
  activeTab,
  visibleMenuLinks,
  onNavigate,
}: AppSidebarProps) {
  return (
    <aside className="hidden min-h-[calc(100vh-4.75rem)] w-72 shrink-0 overflow-hidden border-r border-[#d8d6c9] bg-[#fbfaf5] shadow-sm lg:block">
      <div className="border-b border-[#e4dfcf] bg-white px-4 py-4">
        <p className="mt-1 font-semibold text-[#13251d]">Módulos do sistema</p>
      </div>

      <nav className="hide-scrollbar h-[calc(100%-4.75rem)] space-y-1 overflow-y-auto p-3">
        {visibleMenuLinks.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
              className={`group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition ${
                isActive
                  ? "bg-[#173f31] text-white shadow-sm"
                  : "text-[#466255] hover:bg-[#eef4e6] hover:text-[#173f31]"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition ${
                  isActive
                    ? "bg-white/15 text-[#e6c46a]"
                    : "bg-white text-[#173f31] group-hover:bg-white"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

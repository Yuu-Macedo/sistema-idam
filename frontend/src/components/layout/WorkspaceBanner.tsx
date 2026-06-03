import { ChevronRight, DatabaseZap, Leaf, ShieldCheck, Wifi } from "lucide-react";
import type { MenuLink } from "../../types/app";

interface WorkspaceBannerProps {
  activeMenuItem?: MenuLink;
}

export function WorkspaceBanner({ activeMenuItem }: WorkspaceBannerProps) {
  const ActiveIcon = activeMenuItem?.icon || Leaf;
  const moduleSignals = [
    { label: "API ativa", icon: DatabaseZap },
    { label: "Ambiente seguro", icon: ShieldCheck },
    { label: "Campo conectado", icon: Wifi },
  ];

  return (
    <section className="idam-page-hero mb-5 px-4 py-5 sm:px-6 lg:px-7">
      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <nav
            className="mb-3 flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/68"
            aria-label="Breadcrumb"
          >
            <span>IDAM</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>Sistema</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate text-[#dff2e6]">
              {activeMenuItem?.label || "Area de trabalho"}
            </span>
          </nav>

          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/14 text-white ring-1 ring-white/20">
              <ActiveIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold leading-tight text-white sm:text-2xl">
                {activeMenuItem?.label || "Area de trabalho"}
              </h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-white/76">
                Fluxo operacional para cadastro, acompanhamento tecnico,
                documentacao rural e gestao publica do Instituto.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-3">
          {moduleSignals.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-lg border border-white/14 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white backdrop-blur"
              >
                <Icon className="mx-auto mb-1 h-4 w-4 text-[#dff2e6]" />
                {item.label}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

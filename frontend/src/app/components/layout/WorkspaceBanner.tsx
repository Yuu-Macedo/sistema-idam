import { Leaf } from "lucide-react";
import type { MenuLink } from "../../types";

interface WorkspaceBannerProps {
  activeMenuItem?: MenuLink;
}

export function WorkspaceBanner({ activeMenuItem }: WorkspaceBannerProps) {
  const ActiveIcon = activeMenuItem?.icon || Leaf;

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-[#d8d6c9] bg-[#fbfaf5] shadow-sm">
      <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#173f31] text-white sm:h-12 sm:w-12">
            <ActiveIcon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9b741d]">
              Área de trabalho IDAM
            </p>
            <h2 className="mt-1 break-words text-xl font-semibold text-[#13251d] sm:text-2xl">
              {activeMenuItem?.label || "Sistema de Cadastro Rural"}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#607368]">
              Fluxo organizado para atendimento, acompanhamento técnico e
              documentação rural do Instituto.
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
  );
}

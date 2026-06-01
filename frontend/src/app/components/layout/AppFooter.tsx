import { Leaf } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="border-t border-[#d8d6c9] bg-[#173f31] text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.35fr_1fr_auto] lg:px-8">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-[#173f31]">
              <Leaf className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e6c46a]">
                IDAM
              </p>
              <p className="font-semibold leading-tight">
                Instituto de Desenvolvimento Agropecuário e Florestal
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/72">
            Sistema de apoio ao atendimento rural, cadastro produtivo,
            acompanhamento técnico e emissão documental.
          </p>
        </div>

        <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-1">
          {[
            "Cadastro de produtores",
            "Acompanhamento técnico",
            "Cronograma de visitas",
            "Emissão documental",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-white/78">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e6c46a]" />
              {item}
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.08] px-4 py-3 text-sm lg:min-w-56">
          <div>
            <p className="font-semibold text-white">Ambiente interno</p>
            <p className="mt-1 text-white/68">
              Uso técnico e administrativo do Instituto.
            </p>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e6c46a]">
            Sistema IDAM
          </p>
        </div>
      </div>
    </footer>
  );
}

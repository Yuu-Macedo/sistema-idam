import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoadingRoute } from "./components/layout/LoadingRoute";
import type { UsuarioLogado } from "./types";

const RecomendacoesTecnicas = lazy(
  () => import("./pages/RecomendacoesTecnicasPage"),
);
const Atendimento = lazy(() => import("./pages/AtendimentoPage"));
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
const Sobre = lazy(() => import("./pages/SobrePage"));

interface AppRoutesProps {
  homePath: string;
  isAdm: boolean;
  usuarioLogado: UsuarioLogado;
}

export function AppRoutes({
  homePath,
  isAdm,
  usuarioLogado,
}: AppRoutesProps) {
  return (
    <Suspense fallback={<LoadingRoute />}>
      <Routes>
        <Route path="/" element={<Navigate to={homePath} replace />} />
        <Route path="/login" element={<Navigate to={homePath} replace />} />
        <Route path="/app" element={<Navigate to={homePath} replace />} />
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
        <Route path="/app/sobre" element={<Sobre />} />
        <Route path="*" element={<Navigate to={homePath} replace />} />
      </Routes>
    </Suspense>
  );
}

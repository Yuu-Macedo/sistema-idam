import { apiRequest } from "./apiClient";

export interface DashboardReport {
  totais: {
    produtores: number;
    culturas: number;
    registros: number;
    produtores_ativos: number;
  };
  produtores_por_sexo: Array<{ label: string; value: number }>;
  produtores_por_publico: Array<{ label: string; value: number }>;
  produtores_por_zona: Array<{ label: string; value: number }>;
  producao_por_cultura: Array<{ label: string; value: number }>;
  criacao_animal_por_tipo: Array<{ label: string; value: number }>;
}

export function fetchDashboardReport() {
  return apiRequest<DashboardReport>("/relatorios/dashboard/");
}

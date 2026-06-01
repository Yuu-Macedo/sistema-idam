import type { LucideIcon } from "lucide-react";

export type Tab =
  | "painel"
  | "cadastro"
  | "emissao"
  | "cronograma"
  | "atendimento"
  | "recomendacoes"
  | "historico"
  | "relatorio"
  | "trimestre"
  | "veiculos"
  | "comunidades"
  | "sobre";

export type TipoUsuario = "adm" | "tecnico";

export interface UsuarioLogado {
  id: string;
  email: string;
  nome: string;
  tipo: TipoUsuario;
}

export interface MenuLink {
  key: Tab;
  label: string;
  icon: LucideIcon;
  visible: boolean;
}

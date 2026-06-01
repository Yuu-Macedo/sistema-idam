import {
  Calendar,
  ClipboardPenLine,
  FileBarChart,
  FileText,
  History,
  Info,
  LayoutDashboard,
  Truck,
  User as UserIcon,
  UserPlus,
  Users,
} from "lucide-react";
import type { MenuLink, Tab } from "./types";

export const rotasTecnico: Tab[] = [
  "cadastro",
  "atendimento",
  "veiculos",
  "historico",
  "trimestre",
  "recomendacoes",
  "emissao",
  "cronograma",
  "sobre",
];

export const rotasAdmin: Tab[] = [
  "painel",
  "relatorio",
  "comunidades",
  ...rotasTecnico,
];

export function getMenuLinks(isAdm: boolean): MenuLink[] {
  return [
    {
      key: "painel",
      label: "Painel Administrativo",
      icon: LayoutDashboard,
      visible: isAdm,
    },
    {
      key: "relatorio",
      label: "Relatório Geral",
      icon: FileBarChart,
      visible: isAdm,
    },
    {
      key: "comunidades",
      label: "Comunidades",
      icon: Users,
      visible: isAdm,
    },
    {
      key: "atendimento",
      label: "Atendimento",
      icon: UserIcon,
      visible: true,
    },
    {
      key: "cadastro",
      label: "Cadastro de Produtor",
      icon: UserPlus,
      visible: true,
    },
    {
      key: "veiculos",
      label: "Veículos",
      icon: Truck,
      visible: true,
    },
    {
      key: "historico",
      label: "Histórico",
      icon: History,
      visible: true,
    },
    {
      key: "trimestre",
      label: "Histórico por Trimestre",
      icon: Calendar,
      visible: true,
    },
    {
      key: "recomendacoes",
      label: "Recomendações Técnicas",
      icon: ClipboardPenLine,
      visible: true,
    },
    {
      key: "emissao",
      label: "Emissão de Documentos",
      icon: FileText,
      visible: true,
    },
    {
      key: "cronograma",
      label: "Cronograma de Visitas",
      icon: Calendar,
      visible: true,
    },
    {
      key: "sobre",
      label: "Sobre",
      icon: Info,
      visible: true,
    },
  ];
}

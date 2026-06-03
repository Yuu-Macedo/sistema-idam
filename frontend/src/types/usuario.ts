export type TipoUsuario = "adm" | "tecnico" | "visualizador";

export interface UsuarioLogado {
  id: string;
  email: string;
  nome: string;
  tipo: TipoUsuario;
}

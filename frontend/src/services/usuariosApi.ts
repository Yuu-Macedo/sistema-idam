import type { TipoUsuario, UsuarioLogado } from "../types/app";
import { normalizeApiUsuario } from "./authStorage";
import { apiRequest } from "./apiClient";

function toApiTipo(tipo: TipoUsuario) {
  if (tipo === "adm") return "administrador";
  if (tipo === "visualizador") return "visualizador";
  return "tecnico";
}

export async function saveUsuarioApi(usuario: {
  id?: string;
  nome: string;
  email: string;
  senha?: string;
  tipo: TipoUsuario;
  numeroConselho?: string;
}): Promise<UsuarioLogado> {
  const isUpdate = Boolean(usuario.id);
  const data = await apiRequest<{
    id: number | string;
    nome: string;
    email: string;
    tipo_usuario: string;
  }>(isUpdate ? `/usuarios/${usuario.id}/` : "/usuarios/", {
    method: isUpdate ? "PATCH" : "POST",
    body: JSON.stringify({
      nome: usuario.nome,
      email: usuario.email,
      username: usuario.email.split("@")[0],
      cargo: usuario.numeroConselho || "",
      telefone: "",
      tipo_usuario: toApiTipo(usuario.tipo),
      ativo: true,
      ...(usuario.senha ? { password: usuario.senha } : {}),
    }),
  });

  return normalizeApiUsuario(data);
}

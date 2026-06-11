import type { UsuarioLogado } from "../types/app";
import {
  getRefreshToken,
  normalizeApiUsuario,
  saveAuthTokens,
  saveUsuarioLogado,
} from "./authStorage";
import { apiRequest } from "./apiClient";

interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number | string;
    nome: string;
    email: string;
    tipo_usuario: string;
  };
}

export async function loginWithApi(
  email: string,
  senha: string,
): Promise<UsuarioLogado> {
  const data = await apiRequest<LoginResponse>("/auth/login/", {
    method: "POST",
    authenticated: false,
    body: JSON.stringify({
      email,
      password: senha,
    }),
  });

  const usuario = normalizeApiUsuario(data.user);
  saveAuthTokens(data.access, data.refresh);
  saveUsuarioLogado(usuario);
  return usuario;
}

export async function logoutWithApi() {
  const refresh = getRefreshToken();
  if (!refresh) return;

  await apiRequest("/auth/logout/", {
    method: "POST",
    body: JSON.stringify({ refresh }),
  });
}

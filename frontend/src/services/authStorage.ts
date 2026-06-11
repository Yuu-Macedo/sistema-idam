import type { TipoUsuario, UsuarioLogado } from "../types/app";

type UsuarioSalvo = {
  id?: string;
  nome?: string;
  email?: string;
  senha?: string;
  tipo?: string;
  dataCadastro?: string;
};

const USUARIOS_STORAGE_KEY = "usuarios";
const USUARIO_LOGADO_STORAGE_KEY = "usuarioLogado";
const ACCESS_TOKEN_STORAGE_KEY = "idamAccessToken";
const REFRESH_TOKEN_STORAGE_KEY = "idamRefreshToken";

function normalizeUsuarioLogado(usuario: UsuarioSalvo): UsuarioLogado {
  return {
    id: String(usuario.id || ""),
    nome: String(usuario.nome || ""),
    email: String(usuario.email || ""),
    tipo: (usuario.tipo || "tecnico") as TipoUsuario,
  };
}

export function normalizeTipoUsuario(tipo?: string): TipoUsuario {
  if (tipo === "administrador" || tipo === "adm") return "adm";
  if (tipo === "visualizador") return "visualizador";
  return "tecnico";
}

export function normalizeApiUsuario(usuario: {
  id?: number | string;
  nome?: string;
  email?: string;
  tipo_usuario?: string;
  tipo?: string;
}): UsuarioLogado {
  return {
    id: String(usuario.id || ""),
    nome: String(usuario.nome || ""),
    email: String(usuario.email || ""),
    tipo: normalizeTipoUsuario(usuario.tipo_usuario || usuario.tipo),
  };
}

export function getUsuariosSalvos(): UsuarioSalvo[] {
  try {
    const usuarios = JSON.parse(localStorage.getItem(USUARIOS_STORAGE_KEY) || "[]");
    return Array.isArray(usuarios) ? (usuarios as UsuarioSalvo[]) : [];
  } catch {
    localStorage.removeItem(USUARIOS_STORAGE_KEY);
    return [];
  }
}

export function getUsuarioLogado(): UsuarioLogado | null {
  const usuario = localStorage.getItem(USUARIO_LOGADO_STORAGE_KEY);
  if (!usuario) return null;

  try {
    return normalizeUsuarioLogado(JSON.parse(usuario) as UsuarioSalvo);
  } catch {
    clearUsuarioLogado();
    return null;
  }
}

export function saveUsuarioLogado(usuario: UsuarioLogado) {
  localStorage.setItem(
    USUARIO_LOGADO_STORAGE_KEY,
    JSON.stringify({
      ...usuario,
      loginTime: new Date().toISOString(),
    }),
  );
}

export function saveAuthTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refresh);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function clearUsuarioLogado() {
  localStorage.removeItem(USUARIO_LOGADO_STORAGE_KEY);
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

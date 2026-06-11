export const RESOURCE_CACHE_KEYS = {
  produtores: "produtores",
  comunidades: "comunidades",
  veiculos: "veiculosUnidade",
  cronogramas: "cronogramas",
  visitas: "visitas",
  recomendacoes: "recomendacoesTecnicas",
  atendimentos: "atendimentos",
  documentos: "historicoDocumentos",
} as const;

export type ResourceCacheKey =
  (typeof RESOURCE_CACHE_KEYS)[keyof typeof RESOURCE_CACHE_KEYS];

export function readCache<T>(key: ResourceCacheKey | string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

export function writeCache<T>(key: ResourceCacheKey | string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function writeResourceSnapshot(snapshot: {
  produtores?: unknown[];
  comunidades?: unknown[];
  veiculos?: unknown[];
  cronogramas?: unknown[];
  recomendacoes?: unknown[];
  atendimentos?: unknown[];
  documentos?: unknown[];
}) {
  if (snapshot.produtores) {
    writeCache(RESOURCE_CACHE_KEYS.produtores, snapshot.produtores);
  }

  if (snapshot.comunidades) {
    writeCache(RESOURCE_CACHE_KEYS.comunidades, snapshot.comunidades);
  }

  if (snapshot.veiculos) {
    writeCache(RESOURCE_CACHE_KEYS.veiculos, snapshot.veiculos);
  }

  if (snapshot.cronogramas) {
    writeCache(RESOURCE_CACHE_KEYS.cronogramas, snapshot.cronogramas);
    writeCache(RESOURCE_CACHE_KEYS.visitas, snapshot.cronogramas);
  }

  if (snapshot.recomendacoes) {
    writeCache(RESOURCE_CACHE_KEYS.recomendacoes, snapshot.recomendacoes);
  }

  if (snapshot.atendimentos) {
    writeCache(RESOURCE_CACHE_KEYS.atendimentos, snapshot.atendimentos);
  }

  if (snapshot.documentos) {
    writeCache(RESOURCE_CACHE_KEYS.documentos, snapshot.documentos);
  }
}

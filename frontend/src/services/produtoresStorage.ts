import type { ProdutorBase } from "../types/produtor";
import { readCache, RESOURCE_CACHE_KEYS, writeCache } from "./localCache";

export function getProdutoresStorage(): ProdutorBase[] {
  return readCache<ProdutorBase[]>(RESOURCE_CACHE_KEYS.produtores, []);
}

export function setProdutoresStorage(produtores: ProdutorBase[]) {
  writeCache(RESOURCE_CACHE_KEYS.produtores, produtores);
}

export function upsertProdutorStorage(produtor: ProdutorBase) {
  const produtores = getProdutoresStorage();
  const id = produtor.id || Date.now().toString();
  const existe = produtores.some((item) => item.id === id);

  const atualizados = existe
    ? produtores.map((item) => (item.id === id ? { ...item, ...produtor, id } : item))
    : [...produtores, { ...produtor, id }];

  setProdutoresStorage(atualizados);
  return { ...produtor, id };
}

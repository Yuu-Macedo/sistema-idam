import type { ProdutorBase } from "../types/produtor";
import { apiRequest } from "./apiClient";

type AnyRecord = Record<string, any>;

interface PaginatedResponse<T> {
  count: number;
  results: T[];
}

function onlyDigits(value?: string) {
  return String(value || "").replace(/\D/g, "");
}

function normalizeChoice(value: unknown, fallback = "") {
  return String(value || fallback)
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function normalizeSexo(value: unknown) {
  const normalized = normalizeChoice(value);
  return normalized === "masculino" ? "masculino" : "feminino";
}

function normalizePublico(value: unknown) {
  const normalized = normalizeChoice(value);
  if (normalized === "homem" || normalized === "mulher" || normalized === "jovem") {
    return normalized;
  }
  return "homem";
}

function normalizeTipoLocalizacao(value: unknown) {
  const normalized = normalizeChoice(value);
  if (normalized.includes("urbana")) return "zona_urbana";
  return "zona_rural";
}

function toDecimal(value: unknown) {
  const number = Number(String(value || "0").replace(",", "."));
  return Number.isFinite(number) ? number.toFixed(2) : "0.00";
}

function mapApiProdutorToFrontend(produtor: AnyRecord): ProdutorBase {
  return {
    ...produtor,
    id: String(produtor.id),
    nome: produtor.nome_completo || produtor.nome || "",
    cpf: produtor.cpf || "",
    rg: produtor.rg || "",
    dataNascimento: produtor.data_nascimento || "",
    sexo: produtor.sexo || "",
    publico: produtor.publico || "",
    telefone: produtor.telefone || "",
    email: produtor.email || "",
    logradouro: produtor.endereco || "",
    comunidade: produtor.comunidade || "",
    observacoes: produtor.observacoes || "",
    dataCadastro: produtor.data_cadastro || produtor.dataCadastro || "",
    culturasAgricolas: (produtor.culturas || []).map((cultura: AnyRecord) => ({
      id: String(cultura.id),
      tipoCultura: cultura.nome_cultura,
      subtipoAgricultura: cultura.subtipo,
      areaPlantada: String(cultura.area_plantada || ""),
      areaColhida: String(cultura.area_plantada || ""),
      quantidadeProduzida: String(cultura.quantidade_produzida || ""),
      unidadeMedida: cultura.unidade_producao || "kg",
      produtividadeEstimada: String(cultura.resultado_calculo || ""),
      observacoes: cultura.observacoes || "",
    })),
    possuiCarteiraProdutor: Boolean((produtor.carteiras || []).length),
    carteiraProdutor: produtor.carteiras?.[0]
      ? {
          numero: produtor.carteiras[0].numero_carteira || "",
          emissao: produtor.carteiras[0].data_emissao || "",
          vencimento: produtor.carteiras[0].data_validade || "",
          orgaoEmissor: produtor.carteiras[0].orgao_emissor || "",
          observacoes: produtor.carteiras[0].observacoes || "",
        }
      : undefined,
    localizacaoCaracteristica: produtor.localizacao?.tipo_localizacao || "",
    caracteristicaLocalizacao: produtor.localizacao?.tipo_localizacao || "",
    acessoLocalizacao: produtor.localizacao?.acesso || "",
    latitude: produtor.localizacao?.latitude || "",
    longitude: produtor.localizacao?.longitude || "",
    paa: produtor.paa
      ? {
          participa: produtor.paa.participa_paa,
          perfil: produtor.paa.perfil || "",
          propriedade: produtor.paa.dados_propriedade || "",
          observacoes: produtor.paa.observacoes || "",
        }
      : undefined,
  };
}

function mapFrontendProdutorToApi(produtor: AnyRecord) {
  const endereco = [
    produtor.logradouro,
    produtor.bairro,
    produtor.municipio,
    produtor.uf,
    produtor.cep,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    nome_completo: produtor.nome,
    cpf: onlyDigits(produtor.cpf),
    rg: produtor.rg || "",
    data_nascimento: produtor.dataNascimento || null,
    sexo: normalizeSexo(produtor.sexo),
    publico: normalizePublico(produtor.publico),
    telefone: produtor.telefone || "",
    email: produtor.email || "",
    endereco,
    comunidade: produtor.comunidade || "",
    observacoes: produtor.observacoes || produtor.observacoesBeneficiario || "",
    ativo: true,
  };
}

export async function fetchProdutoresApi(): Promise<ProdutorBase[]> {
  const data = await apiRequest<PaginatedResponse<AnyRecord> | AnyRecord[]>("/produtores/");
  const items = Array.isArray(data) ? data : data.results;
  return items.map(mapApiProdutorToFrontend);
}

export async function saveProdutorApi(produtor: AnyRecord, produtorId?: string) {
  const isUpdate = Boolean(produtorId);
  const saved = await apiRequest<AnyRecord>(
    isUpdate ? `/produtores/${produtorId}/` : "/produtores/",
    {
      method: isUpdate ? "PATCH" : "POST",
      body: JSON.stringify(mapFrontendProdutorToApi(produtor)),
    },
  );

  const id = saved.id;

  await syncProdutorRelations(id, produtor);
  const detailed = await apiRequest<AnyRecord>(`/produtores/${id}/`);
  return mapApiProdutorToFrontend(detailed);
}

async function syncProdutorRelations(produtorId: number | string, produtor: AnyRecord) {
  await Promise.allSettled([
    syncCulturas(produtorId, produtor),
    syncLocalizacao(produtorId, produtor),
    syncPaa(produtorId, produtor),
    syncCarteira(produtorId, produtor),
    syncCriacaoAnimal(produtorId, produtor),
    syncMeliponicultura(produtorId, produtor),
  ]);
}

async function syncCulturas(produtorId: number | string, produtor: AnyRecord) {
  const culturas = produtor.culturasAgricolas || [];
  await Promise.all(
    culturas
      .filter((cultura: AnyRecord) => cultura.tipoCultura || cultura.subtipoAgricultura)
      .map((cultura: AnyRecord) =>
        apiRequest(`/produtores/${produtorId}/culturas/`, {
          method: "POST",
          body: JSON.stringify({
            nome_cultura: cultura.tipoCultura || cultura.subtipoAgricultura || "Cultura",
            subtipo: normalizeChoice(cultura.subtipoAgricultura || cultura.tipoCultura || "outras_culturas"),
            area_plantada: toDecimal(cultura.areaPlantada || cultura.areaColhida),
            unidade_area: "ha",
            quantidade_produzida: toDecimal(cultura.quantidadeProduzida),
            unidade_producao: cultura.unidadeMedida || "kg",
            producao_organica: Boolean(produtor.producaoOrganica),
            observacoes: cultura.observacoes || "",
          }),
        }),
      ),
  );
}

async function syncLocalizacao(produtorId: number | string, produtor: AnyRecord) {
  if (!produtor.tipoLocalizacao && !produtor.comunidade && !produtor.acessoLocalizacao) return;

  await apiRequest(`/produtores/${produtorId}/localizacao/`, {
    method: "POST",
    body: JSON.stringify({
      tipo_localizacao: normalizeTipoLocalizacao(produtor.tipoLocalizacao || produtor.localizacaoCaracteristica),
      endereco: [produtor.logradouro, produtor.bairro, produtor.municipio, produtor.uf]
        .filter(Boolean)
        .join(", "),
      comunidade: produtor.comunidade || "",
      ramal: produtor.km || "",
      ponto_referencia: produtor.especificacaoLocalizacao || "",
      acesso: produtor.acessoLocalizacao || "",
      latitude: produtor.latitude || null,
      longitude: produtor.longitude || null,
      observacoes: produtor.observacoes || "",
    }),
  });
}

async function syncPaa(produtorId: number | string, produtor: AnyRecord) {
  if (!produtor.paa) return;

  await apiRequest(`/produtores/${produtorId}/paa/`, {
    method: "POST",
    body: JSON.stringify({
      participa_paa: Boolean(produtor.paa.participa),
      perfil: produtor.paa.perfil || "",
      dados_propriedade: produtor.paa.propriedade || "",
      documentos_entregues: [],
      observacoes: produtor.paa.observacoes || "",
    }),
  });
}

async function syncCarteira(produtorId: number | string, produtor: AnyRecord) {
  if (!produtor.possuiCarteiraProdutor && !produtor.carteiraProdutor?.numero) return;

  await apiRequest(`/produtores/${produtorId}/carteira/`, {
    method: "POST",
    body: JSON.stringify({
      numero_carteira: produtor.carteiraProdutor?.numero || produtor.numeroCarteiraProdutor || "Sem número",
      tipo_carteira: "Produtor rural",
      data_emissao: produtor.carteiraProdutor?.emissao || null,
      data_validade: produtor.carteiraProdutor?.vencimento || produtor.vencimentoCarteiraProdutor || null,
      orgao_emissor: produtor.carteiraProdutor?.orgaoEmissor || "IDAM",
      observacoes: produtor.carteiraProdutor?.observacoes || "",
    }),
  });
}

async function syncCriacaoAnimal(produtorId: number | string, produtor: AnyRecord) {
  if (!produtor.avicultura?.especies?.length) return;

  await apiRequest(`/produtores/${produtorId}/criacao-animal/`, {
    method: "POST",
    body: JSON.stringify({
      tipo_criacao: "Avicultura",
      sistema_criacao: produtor.avicultura.sistemaCriacao || produtor.sistemaCriacao || "",
      producao_organica: Boolean(produtor.avicultura.organica),
      observacoes: produtor.avicultura.observacoes || "",
    }),
  });
}

async function syncMeliponicultura(produtorId: number | string, produtor: AnyRecord) {
  if (!produtor.abelhas?.length) return;

  const especies = await apiRequest<PaginatedResponse<AnyRecord> | AnyRecord[]>("/especies-abelhas/");
  const lista = Array.isArray(especies) ? especies : especies.results;
  const especie = lista[0];
  if (!especie) return;

  await apiRequest(`/produtores/${produtorId}/meliponicultura/`, {
    method: "POST",
    body: JSON.stringify({
      especie: especie.id,
      quantidade_colmeias: Number(produtor.quantidadeColmeias || 0),
      producao_mel: toDecimal(produtor.producaoMel),
      unidade_producao: "kg",
      observacoes: produtor.observacoes || "",
    }),
  });
}

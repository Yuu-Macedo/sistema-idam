import { apiRequest } from "./apiClient";
import { writeResourceSnapshot } from "./localCache";
import { enqueueSyncOperation, isTransientSyncError } from "./syncQueue";

interface PaginatedResponse<T> {
  results: T[];
}

type AnyRecord = Record<string, any>;

async function fetchList(path: string) {
  const data = await apiRequest<PaginatedResponse<AnyRecord> | AnyRecord[]>(path);
  return Array.isArray(data) ? data : data.results;
}

async function createResource(path: string, payload: AnyRecord) {
  try {
    return await apiRequest<AnyRecord>(path, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (isTransientSyncError(error)) {
      enqueueSyncOperation({ path, method: "POST", payload });
    }
    throw error;
  }
}

async function updateResource(path: string, id: string, payload: AnyRecord) {
  const resourcePath = `${path}${id}/`;
  try {
    return await apiRequest<AnyRecord>(resourcePath, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (isTransientSyncError(error)) {
      enqueueSyncOperation({ path: resourcePath, method: "PATCH", payload });
    }
    throw error;
  }
}

async function deleteResource(path: string, id: string) {
  const resourcePath = `${path}${id}/`;
  try {
    await apiRequest(resourcePath, {
      method: "DELETE",
    });
  } catch (error) {
    if (isTransientSyncError(error)) {
      enqueueSyncOperation({ path: resourcePath, method: "DELETE" });
    }
    throw error;
  }
}

const mapComunidade = (item: AnyRecord) => ({
  id: String(item.id),
  nome: item.nome || "",
  municipio: item.municipio || "",
  localizacao: item.localizacao || "",
  dataCadastro: item.data_cadastro || "",
});

const mapVeiculo = (item: AnyRecord) => ({
  id: String(item.id),
  placa: item.placa || "",
  modelo: item.modelo || "",
  marca: item.marca || "",
  ano: item.ano || "",
  cor: item.cor || "",
  tipo: item.tipo || "",
  quilometragem: item.quilometragem || "",
  status: item.status || "Disponível",
  gasolina: item.gasolina || 0,
  observacoes: item.observacoes || "",
  dataCadastro: item.data_cadastro || "",
  responsavelCadastro: item.responsavel_cadastro || "",
  tecnicoEmUsoId: item.tecnico_em_uso ? String(item.tecnico_em_uso) : "",
  tecnicoEmUsoNome: item.tecnico_em_uso_nome || "",
  finalidadeUso: item.finalidade_uso || "",
  dataRetirada: item.data_retirada || "",
  historicoUso: item.historico_uso || [],
});

const mapCronograma = (item: AnyRecord) => ({
  ...(item.payload || {}),
  id: String(item.id),
  produtorId: item.produtor ? String(item.produtor) : item.payload?.produtorId,
  produtorNome: item.produtor_nome || item.payload?.produtorNome,
  tecnico: item.tecnico_nome || item.payload?.tecnico || "",
  tecnicoId: item.tecnico ? String(item.tecnico) : item.payload?.tecnicoId,
  diaSemana: item.dia_semana || item.payload?.diaSemana,
  turno: item.turno || item.payload?.turno,
  horarioSaidaManha: item.horario_saida_manha || item.payload?.horarioSaidaManha,
  horarioEntradaManha: item.horario_entrada_manha || item.payload?.horarioEntradaManha,
  horarioSaidaTarde: item.horario_saida_tarde || item.payload?.horarioSaidaTarde,
  horarioEntradaTarde: item.horario_entrada_tarde || item.payload?.horarioEntradaTarde,
  atividade: item.atividade || item.payload?.atividade,
  observacoes: item.observacoes || item.payload?.observacoes,
  recomendacoes: item.recomendacoes || item.payload?.recomendacoes,
  cor: item.cor || item.payload?.cor,
  semana: item.semana || item.payload?.semana,
  dataCriacao: item.data_criacao || item.payload?.dataCriacao,
});

const mapRecomendacao = (item: AnyRecord) => ({
  id: String(item.id),
  produtorNome: item.produtor_nome || "",
  produtorCpf: item.produtor_cpf || "",
  recomendacao: item.recomendacao || "",
  tecnicoResponsavel: item.tecnico_responsavel || "",
  tecnicoResponsavelId: item.tecnico ? String(item.tecnico) : "",
  criadoPorId: item.criado_por ? String(item.criado_por) : "",
  data: item.data || "",
  documento: item.documento || "",
  dataCriacao: item.data_criacao || "",
});

const mapAtendimento = (item: AnyRecord) => ({
  id: String(item.id),
  produtorId: item.produtor ? String(item.produtor) : "",
  produtorNome: item.produtor_nome || "",
  produtorCpf: item.produtor_cpf || "",
  tecnicoResponsavel: item.tecnico_responsavel || "",
  data: item.data || "",
  tipo: item.tipo || "",
  descricao: item.descricao || "",
  dados: item.dados || {},
});

const mapDocumento = (item: AnyRecord) => ({
  id: String(item.id),
  produtorId: item.produtor ? String(item.produtor) : "",
  produtorNome: item.produtor_nome || "",
  produtorCpf: item.produtor_cpf || "",
  tipoDocumento: item.tipo_documento || "",
  geradoPorId: item.gerado_por ? String(item.gerado_por) : "",
  geradoPorNome: item.gerado_por_nome || "",
  dataGeracao: item.data_geracao || "",
  payload: item.payload || {},
});

export async function syncApiResourcesToLocalStorage() {
  const [
    comunidades,
    veiculos,
    cronogramas,
    recomendacoes,
    atendimentos,
    documentos,
  ] = await Promise.all([
    fetchList("/comunidades/").then((items) => items.map(mapComunidade)),
    fetchList("/veiculos/").then((items) => items.map(mapVeiculo)),
    fetchList("/cronogramas/").then((items) => items.map(mapCronograma)),
    fetchList("/recomendacoes-tecnicas/").then((items) => items.map(mapRecomendacao)),
    fetchList("/atendimentos/").then((items) => items.map(mapAtendimento)),
    fetchList("/documentos-emitidos/").then((items) => items.map(mapDocumento)),
  ]);

  writeResourceSnapshot({
    comunidades,
    veiculos,
    cronogramas,
    recomendacoes,
    atendimentos,
    documentos,
  });
}

export async function saveComunidadeApi(comunidade: AnyRecord) {
  const payload = {
    nome: comunidade.nome,
    municipio: comunidade.municipio,
    localizacao: comunidade.localizacao || "",
  };
  const data = comunidade.id
    ? await updateResource("/comunidades/", comunidade.id, payload)
    : await createResource("/comunidades/", payload);
  return mapComunidade(data);
}

export function deleteComunidadeApi(id: string) {
  return deleteResource("/comunidades/", id);
}

export async function saveVeiculoApi(veiculo: AnyRecord) {
  const payload = {
    placa: veiculo.placa,
    modelo: veiculo.modelo,
    marca: veiculo.marca || "",
    ano: veiculo.ano || "",
    cor: veiculo.cor || "",
    tipo: veiculo.tipo || "",
    quilometragem: veiculo.quilometragem || "",
    status: veiculo.status || "Disponível",
    gasolina: Number(veiculo.gasolina || 0),
    observacoes: veiculo.observacoes || "",
    responsavel_cadastro: veiculo.responsavelCadastro || "",
    finalidade_uso: veiculo.finalidadeUso || "",
    data_retirada: veiculo.dataRetirada || null,
    historico_uso: veiculo.historicoUso || [],
  };
  const data = veiculo.id
    ? await updateResource("/veiculos/", veiculo.id, payload)
    : await createResource("/veiculos/", payload);
  return mapVeiculo(data);
}

export function deleteVeiculoApi(id: string) {
  return deleteResource("/veiculos/", id);
}

export async function saveCronogramaApi(visita: AnyRecord) {
  const payload = {
    produtor: visita.produtorId || null,
    produtor_nome: visita.produtorNome || "",
    tecnico_nome: visita.tecnico || "",
    dia_semana: visita.diaSemana,
    turno: visita.turno || "manha",
    horario_saida_manha: visita.horarioSaidaManha || "",
    horario_entrada_manha: visita.horarioEntradaManha || "",
    horario_saida_tarde: visita.horarioSaidaTarde || "",
    horario_entrada_tarde: visita.horarioEntradaTarde || "",
    atividade: visita.atividade,
    observacoes: visita.observacoes || "",
    recomendacoes: visita.recomendacoes || "",
    cor: visita.cor || "",
    semana: visita.semana || null,
    payload: visita,
  };
  const data = visita.id && !/^\d{13,}$/.test(String(visita.id))
    ? await updateResource("/cronogramas/", visita.id, payload)
    : await createResource("/cronogramas/", payload);
  return mapCronograma(data);
}

export function deleteCronogramaApi(id: string) {
  return deleteResource("/cronogramas/", id);
}

export async function saveRecomendacaoApi(recomendacao: AnyRecord) {
  const payload = {
    produtor_nome: recomendacao.produtorNome,
    produtor_cpf: recomendacao.produtorCpf || "",
    recomendacao: recomendacao.recomendacao,
    tecnico_responsavel: recomendacao.tecnicoResponsavel || "",
    data: recomendacao.data,
    documento: recomendacao.documento || "",
  };
  const data = recomendacao.id && !/^\d{13,}$/.test(String(recomendacao.id))
    ? await updateResource("/recomendacoes-tecnicas/", recomendacao.id, payload)
    : await createResource("/recomendacoes-tecnicas/", payload);
  return mapRecomendacao(data);
}

export async function saveAtendimentoApi(atendimento: AnyRecord) {
  const payload = {
    produtor: atendimento.produtorId || null,
    produtor_nome: atendimento.produtorNome || "",
    produtor_cpf: atendimento.produtorCpf || "",
    tecnico_responsavel: atendimento.tecnicoResponsavel || "",
    data: atendimento.data || null,
    tipo: atendimento.tipo || "",
    descricao: atendimento.descricao || "",
    dados: atendimento.dados || atendimento,
  };
  const data = atendimento.id && !/^\d{13,}$/.test(String(atendimento.id))
    ? await updateResource("/atendimentos/", atendimento.id, payload)
    : await createResource("/atendimentos/", payload);
  return mapAtendimento(data);
}

export async function saveDocumentoEmitidoApi(documento: AnyRecord) {
  const payload = {
    produtor: documento.produtorId || null,
    produtor_nome: documento.produtorNome || "",
    produtor_cpf: documento.produtorCpf || "",
    tipo_documento: documento.tipoDocumento || documento.tipo || "Documento",
    gerado_por_nome: documento.geradoPorNome || "",
    payload: documento,
  };
  const data = await createResource("/documentos-emitidos/", payload);
  return mapDocumento(data);
}

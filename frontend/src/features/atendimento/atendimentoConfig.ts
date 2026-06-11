export function buildConfiguracoesAgricultura(condicoes: {
  possuiGraos: boolean;
  possuiHorticultura: boolean;
  possuiFruticultura: boolean;
  possuiMandioca: boolean;
  possuiCulturasIndustriais: boolean;
}) {
  return [
    { condicao: condicoes.possuiGraos, key: "graos", titulo: "Grãos" },
    { condicao: condicoes.possuiHorticultura, key: "horticultura", titulo: "Horticultura" },
    { condicao: condicoes.possuiFruticultura, key: "fruticultura", titulo: "Fruticultura" },
    { condicao: condicoes.possuiMandioca, key: "mandioca", titulo: "Mandioca" },
    {
      condicao: condicoes.possuiCulturasIndustriais,
      key: "culturasIndustriais",
      titulo: "Culturas Industriais",
    },
  ] as const;
}

export function buildConfiguracoesPecuaria(condicoes: {
  possuiBovinocultura: boolean;
  possuiAvicultura: boolean;
  possuiSuinocultura: boolean;
  possuiBubalinocultura: boolean;
  possuiCaprinocultura: boolean;
  possuiOvinocultura: boolean;
  possuiEquinos: boolean;
  possuiCodorna: boolean;
  possuiPatoDomestico: boolean;
}) {
  return [
    { condicao: condicoes.possuiBovinocultura, key: "bovinocultura", titulo: "Bovinocultura" },
    { condicao: condicoes.possuiAvicultura, key: "avicultura", titulo: "Avicultura" },
    { condicao: condicoes.possuiSuinocultura, key: "suinocultura", titulo: "Suinocultura" },
    { condicao: condicoes.possuiBubalinocultura, key: "bubalinocultura", titulo: "Bubalinocultura" },
    { condicao: condicoes.possuiCaprinocultura, key: "caprinocultura", titulo: "Caprinocultura" },
    { condicao: condicoes.possuiOvinocultura, key: "ovinocultura", titulo: "Ovinocultura" },
    { condicao: condicoes.possuiEquinos, key: "equinos", titulo: "Equinos" },
    { condicao: condicoes.possuiCodorna, key: "codorna", titulo: "Codorna" },
    { condicao: condicoes.possuiPatoDomestico, key: "patoDomestico", titulo: "Pato Doméstico" },
  ] as const;
}

export function buildConfiguracoesApicultura(condicoes: {
  possuiApicultura: boolean;
  possuiMeliponicultura: boolean;
}) {
  return [
    { condicao: condicoes.possuiApicultura, key: "apicultura", titulo: "Apicultura" },
    { condicao: condicoes.possuiMeliponicultura, key: "meliponicultura", titulo: "Meliponicultura" },
  ] as const;
}

export function buildConfiguracoesExtrativismo(condicoes: {
  possuiMadeira: boolean;
  possuiNaoMadeireira: boolean;
  possuiExtrativismoVegetal: boolean;
  possuiExtrativismoMineral: boolean;
}) {
  return [
    {
      condicao: condicoes.possuiMadeira,
      key: "madeira",
      titulo: "Produção Florestal de Madeira",
    },
    {
      condicao: condicoes.possuiNaoMadeireira,
      key: "naoMadeireira",
      titulo: "Produção Florestal Não Madeireira",
    },
    {
      condicao: condicoes.possuiExtrativismoVegetal,
      key: "vegetal",
      titulo: "Extrativismo Vegetal",
    },
    {
      condicao: condicoes.possuiExtrativismoMineral,
      key: "mineral",
      titulo: "Extrativismo Mineral",
    },
  ] as const;
}

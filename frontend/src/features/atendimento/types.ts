export interface ProdutorAtendimento {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  estado: string;
  dataCadastro?: string;
  atividades?: {
    categoria: string;
    tipos: string[];
  }[];
}

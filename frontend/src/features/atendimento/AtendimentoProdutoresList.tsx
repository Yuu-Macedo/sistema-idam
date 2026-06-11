import { User } from "lucide-react";

import type { ProdutorAtendimento } from "./types";

interface AtendimentoProdutoresListProps {
  produtores: ProdutorAtendimento[];
  searchTerm: string;
  selectedProdutorId?: string;
  onSelectProdutor: (produtor: ProdutorAtendimento) => void;
  obterTrimestre: (data: string) => number;
}

export function AtendimentoProdutoresList({
  produtores,
  searchTerm,
  selectedProdutorId,
  onSelectProdutor,
  obterTrimestre,
}: AtendimentoProdutoresListProps) {
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">
          Produtores Cadastrados ({produtores.length})
        </h3>
      </div>

      <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
        {produtores.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {searchTerm ? "Nenhum produtor encontrado" : "Nenhum produtor cadastrado"}
          </div>
        ) : (
          produtores.map((produtor) => {
            const trimestre = produtor.dataCadastro ? obterTrimestre(produtor.dataCadastro) : null;
            const dataCadastroFormatada = produtor.dataCadastro
              ? new Date(produtor.dataCadastro).toLocaleDateString("pt-BR")
              : "Não informado";

            return (
              <button
                key={produtor.id}
                onClick={() => onSelectProdutor(produtor)}
                className={`w-full p-4 text-left hover:bg-accent transition-colors ${
                  selectedProdutorId === produtor.id ? "bg-accent" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {produtor.nome}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      CPF: {produtor.cpf}
                    </p>
                    {trimestre && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                          {trimestre}º Trimestre
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {dataCadastroFormatada}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

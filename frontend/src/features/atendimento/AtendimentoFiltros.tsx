import { Search } from "lucide-react";

interface AtendimentoFiltrosProps {
  searchTerm: string;
  trimestreSelecionado: string;
  produtoresPorTrimestre: Record<number, unknown[]>;
  onSearchTermChange: (value: string) => void;
  onTrimestreChange: (value: string) => void;
}

export function AtendimentoFiltros({
  searchTerm,
  trimestreSelecionado,
  produtoresPorTrimestre,
  onSearchTermChange,
  onTrimestreChange,
}: AtendimentoFiltrosProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nome ou CPF..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label htmlFor="trimestre" className="block text-sm font-medium text-foreground mb-2">
          Filtrar por Trimestre de Cadastro
        </label>
        <select
          id="trimestre"
          value={trimestreSelecionado}
          onChange={(e) => onTrimestreChange(e.target.value)}
          className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="todos">Todos os Trimestres</option>
          <option value="1">1º Trimestre - Janeiro, Fevereiro e Março ({produtoresPorTrimestre[1].length})</option>
          <option value="2">2º Trimestre - Abril, Maio e Junho ({produtoresPorTrimestre[2].length})</option>
          <option value="3">3º Trimestre - Julho, Agosto e Setembro ({produtoresPorTrimestre[3].length})</option>
          <option value="4">4º Trimestre - Outubro, Novembro e Dezembro ({produtoresPorTrimestre[4].length})</option>
        </select>
      </div>

      {trimestreSelecionado === "todos" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[1, 2, 3, 4].map((trimestre) => (
            <div key={trimestre} className="bg-accent/30 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">
                {produtoresPorTrimestre[trimestre].length}
              </p>
              <p className="text-xs text-muted-foreground">{trimestre}º Trimestre</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

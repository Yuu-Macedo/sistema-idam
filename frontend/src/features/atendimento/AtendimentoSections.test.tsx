import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AtendimentoFiltros } from "./AtendimentoFiltros";
import { AtendimentoProdutoresList } from "./AtendimentoProdutoresList";

describe("Atendimento sections", () => {
  it("renderiza filtros, resumo trimestral e propaga mudancas", () => {
    const onSearchTermChange = vi.fn();
    const onTrimestreChange = vi.fn();

    render(
      <AtendimentoFiltros
        searchTerm="Maria"
        trimestreSelecionado="todos"
        produtoresPorTrimestre={{
          1: [{ id: "1" }],
          2: [],
          3: [{ id: "2" }, { id: "3" }],
          4: [],
        }}
        onSearchTermChange={onSearchTermChange}
        onTrimestreChange={onTrimestreChange}
      />,
    );

    expect(screen.getByDisplayValue("Maria")).toBeInTheDocument();
    expect(screen.getByText("1º Trimestre")).toBeInTheDocument();
    expect(screen.getByText("3º Trimestre")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Buscar por nome ou CPF..."), {
      target: { value: "Joao" },
    });
    fireEvent.change(screen.getByLabelText("Filtrar por Trimestre de Cadastro"), {
      target: { value: "3" },
    });

    expect(onSearchTermChange).toHaveBeenCalledWith("Joao");
    expect(onTrimestreChange).toHaveBeenCalledWith("3");
  });

  it("renderiza lista de produtores e seleciona item", () => {
    const onSelectProdutor = vi.fn();
    const produtor = {
      id: "10",
      nome: "Maria da Silva",
      cpf: "529.982.247-25",
      telefone: "92999990000",
      email: "maria@idam.local",
      endereco: "Ramal 1",
      cidade: "Manaus",
      estado: "AM",
      dataCadastro: "2026-02-12",
    };

    render(
      <AtendimentoProdutoresList
        produtores={[produtor]}
        searchTerm=""
        selectedProdutorId="10"
        onSelectProdutor={onSelectProdutor}
        obterTrimestre={() => 1}
      />,
    );

    expect(screen.getByText("Produtores Cadastrados (1)")).toBeInTheDocument();
    expect(screen.getByText("Maria da Silva")).toBeInTheDocument();
    expect(screen.getByText("CPF: 529.982.247-25")).toBeInTheDocument();
    expect(screen.getByText("1º Trimestre")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Maria da Silva/i }));

    expect(onSelectProdutor).toHaveBeenCalledWith(produtor);
  });

  it("mostra estado vazio considerando busca", () => {
    render(
      <AtendimentoProdutoresList
        produtores={[]}
        searchTerm="Maria"
        selectedProdutorId={undefined}
        onSelectProdutor={vi.fn()}
        obterTrimestre={() => 1}
      />,
    );

    expect(screen.getByText("Nenhum produtor encontrado")).toBeInTheDocument();
  });
});

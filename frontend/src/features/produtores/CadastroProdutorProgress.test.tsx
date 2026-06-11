import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CadastroProdutorProgress } from "./CadastroProdutorProgress";
import { cadastroProdutorSteps } from "./cadastroProdutorConfig";

describe("CadastroProdutorProgress", () => {
  it("renderiza etapa atual, percentual e permite navegar", () => {
    const onStepChange = vi.fn();

    render(
      <CadastroProdutorProgress
        currentStep={2}
        totalSteps={6}
        steps={cadastroProdutorSteps}
        onStepChange={onStepChange}
      />,
    );

    expect(screen.getByText("Roteiro de preenchimento")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Endereço e Localização" }),
    ).toBeInTheDocument();
    expect(screen.getByText("33% completo")).toBeInTheDocument();
    expect(screen.getByText("Dados Pessoais")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Perfil e Propriedade/i }));

    expect(onStepChange).toHaveBeenCalledWith(3);
  });

  it("usa fallback visual quando etapa atual nao existe", () => {
    render(
      <CadastroProdutorProgress
        currentStep={99}
        totalSteps={6}
        steps={cadastroProdutorSteps}
        onStepChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Revisão")).toBeInTheDocument();
    expect(screen.getByText("Confira os dados antes de finalizar.")).toBeInTheDocument();
  });
});

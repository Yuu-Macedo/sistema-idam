import { Check } from "lucide-react";

interface CadastroProdutorStep {
  number: number;
  title: string;
  description: string;
}

interface CadastroProdutorProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: CadastroProdutorStep[];
  onStepChange: (step: number) => void;
}

export function CadastroProdutorProgress({
  currentStep,
  totalSteps,
  steps,
  onStepChange,
}: CadastroProdutorProgressProps) {
  const currentStepMetadata = steps[currentStep - 1];
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <section className="rounded-2xl border border-[#d8d6c9] bg-[#fbfaf5] p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9b741d]">
            Roteiro de preenchimento
          </p>
          <h3 className="mt-1 text-lg font-semibold text-[#13251d]">
            {currentStepMetadata?.title || "Revisão"}
          </h3>
          <p className="text-sm text-[#607368]">
            {currentStepMetadata?.description || "Confira os dados antes de finalizar."}
          </p>
        </div>
        <div className="rounded-lg border border-[#ded9c8] bg-white px-3 py-2 text-sm font-semibold text-[#466255]">
          {progress}% completo
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#e8e2d4]">
        <div
          className="h-full rounded-full bg-[#e6c46a] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-6">
        {steps.map((step) => (
          <button
            type="button"
            key={step.number}
            onClick={() => onStepChange(step.number)}
            className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
              step.number === currentStep
                ? "border-[#e6c46a] bg-[#fbf3da] shadow-sm"
                : step.number < currentStep
                  ? "border-[#c8d7c1] bg-[#f0f6ea]"
                  : "border-[#ded9c8] bg-white hover:bg-[#f4f0e7]"
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${
                step.number <= currentStep
                  ? "bg-[#173f31] text-white"
                  : "bg-[#e8e2d4] text-[#607368]"
              }`}
            >
              {step.number < currentStep ? <Check className="h-4 w-4" /> : step.number}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight text-[#13251d]">
                {step.title}
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#607368]">
                {step.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

import { z } from "zod";

const cpfDigits = (value: string) => value.replace(/\D/g, "");

function isValidCpf(value: string) {
  const digits = cpfDigits(value);
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;

  for (const verifierPosition of [9, 10]) {
    const weightStart = verifierPosition + 1;
    const total = digits
      .slice(0, verifierPosition)
      .split("")
      .reduce((sum, digit, index) => sum + Number(digit) * (weightStart - index), 0);
    const expected = ((total * 10) % 11) % 10;
    if (expected !== Number(digits[verifierPosition])) return false;
  }

  return true;
}

export const loginSchema = z.object({
  email: z.string().trim().email("Informe um email valido."),
  senha: z.string().min(1, "Informe a senha."),
});

export const produtorSchema = z.object({
  nome: z.string().trim().min(3, "Informe o nome do produtor."),
  cpf: z.string().refine(isValidCpf, "CPF invalido."),
  sexo: z.string().min(1, "Informe o sexo."),
  publico: z.string().min(1, "Informe o publico."),
});

export function getValidationMessage(error: unknown) {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message || "Revise os campos informados.";
  }

  return error instanceof Error ? error.message : "Revise os campos informados.";
}

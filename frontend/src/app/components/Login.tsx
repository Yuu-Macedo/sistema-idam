import { useState } from "react";
import {
  ClipboardCheck,
  Eye,
  EyeOff,
  FileSignature,
  Leaf,
  Lock,
  MapPinned,
  Shield,
  User,
} from "lucide-react";

interface LoginProps {
  onLogin: (
    email: string,
    senha: string,
    usuario?: {
      id: string;
      nome: string;
      email: string;
      tipo: "adm" | "tecnico";
    },
  ) => void;
}

interface UsuarioLocalStorage {
  id: string;
  nome: string;
  email: string;
  senha: string;
  tipo?: "adm" | "tecnico";
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!email || !senha) {
      setErro("Por favor, preencha todos os campos");
      return;
    }

    const rawUsuarios = JSON.parse(
      localStorage.getItem("usuarios") || "[]",
    );

    const usuarios: UsuarioLocalStorage[] = Array.isArray(rawUsuarios)
      ? rawUsuarios
      : [];

    const usuario = usuarios.find(
      (u) => u.email === email && u.senha === senha,
    );

    if (usuario) {
      const usuarioLogado = {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        tipo: (usuario.tipo || "tecnico") as "adm" | "tecnico",
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuarioLogado),
      );

      onLogin(usuario.email, senha, usuarioLogado);
    } else {
      setErro("Email ou senha incorretos");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_20%,rgba(45,106,62,0.16),transparent_28%),linear-gradient(135deg,#f7faf5_0%,#edf5e9_48%,#f8f1df_100%)] px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:block">
          <div className="relative max-w-xl">
            <div className="absolute -left-8 top-16 h-72 w-px bg-linear-to-b from-transparent via-primary/25 to-transparent" />
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-primary/15 bg-white/70 px-4 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur">
              <Leaf className="h-4 w-4" />
              Instituto de Desenvolvimento Agropecuário e Florestal
            </div>
            <h1 className="text-5xl font-semibold leading-tight text-slate-950">
              Atendimento rural integrado para a equipe do IDAM.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Cadastro, histórico e emissão aparecem como etapas da mesma visita,
              com contexto suficiente para apoiar o acompanhamento agropecuário e florestal.
            </p>
            <div className="mt-8 space-y-3">
              {[
                {
                  title: "Registro do produtor",
                  detail: "Dados pessoais, área, atividades e perfil produtivo.",
                  icon: ClipboardCheck,
                },
                {
                  title: "Localidade e acompanhamento",
                  detail: "Município, comunidade, técnico responsável e histórico.",
                  icon: MapPinned,
                },
                {
                  title: "Documento pronto para emissão",
                  detail: "Declarações e relatórios conectados ao cadastro.",
                  icon: FileSignature,
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="grid grid-cols-[2.75rem_1fr] gap-3 rounded-xl border border-primary/10 bg-white/75 p-4 shadow-sm backdrop-blur"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        Etapa {index + 1}
                      </p>
                      <p className="mt-1 font-semibold text-slate-950">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full max-w-md justify-self-center overflow-hidden rounded-2xl border border-primary/10 bg-white/95 shadow-2xl shadow-primary/10 backdrop-blur">
          <div className="border-b border-primary/10 bg-[linear-gradient(135deg,rgba(45,106,62,0.10),rgba(255,255,255,0.92)),repeating-linear-gradient(90deg,rgba(45,106,62,0.08)_0_1px,transparent_1px_32px)] p-6 sm:p-8">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-sm">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              IDAM
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Acesse sua área de trabalho
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Perfil técnico ou administrativo, com sessão local neste navegador.
            </p>
          </div>

          <div className="p-6 sm:p-8">
          <div className="mb-7">
            <p className="text-sm font-semibold text-slate-800">
              Credenciais de acesso
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {erro && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
                {erro}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 rounded-lg bg-primary/10 p-1.5">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-lg border border-primary/15 bg-primary/5 py-3.5 pl-12 pr-4 text-slate-900 transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Senha
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 rounded-lg bg-primary/10 p-1.5">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-primary/15 bg-primary/5 py-3.5 pl-12 pr-14 text-slate-900 transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-primary/10 p-1.5 text-primary transition hover:bg-primary/15"
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenha ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary py-3.5 font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-[#245a34] focus:outline-none focus:ring-4 focus:ring-primary/20"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-primary/10 bg-primary/5 p-4 text-sm">
            <div className="flex items-center gap-3 text-primary">
              <div className="rounded-lg bg-white p-1.5 shadow-sm">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <p className="font-medium">
                A sessão fica vinculada ao perfil técnico ou administrativo.
              </p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

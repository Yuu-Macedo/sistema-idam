import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  X,
} from "lucide-react";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha?: string;
  tipo: "adm" | "tecnico";
  numeroConselho?: string;
  dataCadastro?: string;
}

interface CadastroUsuarioProps {
  onClose: () => void;
  onSalvar?: () => void;
  usuarioEdicao?: Usuario | null;
  permitirEscolherTipo?: boolean;
}

export default function CadastroUsuario({
  onClose,
  onSalvar,
  usuarioEdicao = null,
  permitirEscolherTipo = true,
}: CadastroUsuarioProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [tipo, setTipo] = useState<"adm" | "tecnico">("tecnico");
  const [numeroConselho, setNumeroConselho] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] =
    useState(false);
  const [erro, setErro] = useState("");

  const tipoSelectClasses =
    tipo === "tecnico"
      ? "border-blue-200 bg-blue-50 focus:border-blue-500 focus:ring-blue-200"
      : "border-emerald-200 bg-emerald-50 focus:border-emerald-500 focus:ring-emerald-200";

  const tipoBadgeClasses =
    tipo === "tecnico"
      ? "text-blue-900 bg-blue-100 border-blue-200"
      : "text-emerald-900 bg-emerald-100 border-emerald-200";

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (usuarioEdicao) {
      setNome(usuarioEdicao.nome || "");
      setEmail(usuarioEdicao.email || "");
      setTipo(usuarioEdicao.tipo || "tecnico");
      setNumeroConselho(usuarioEdicao.numeroConselho || "");
    }
  }, [usuarioEdicao]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!nome || !email) {
      setErro("Por favor, preencha os campos obrigatórios");
      return;
    }

    if (tipo === "tecnico" && !numeroConselho) {
      setErro("Por favor, informe o número do conselho do técnico");
      return;
    }

    if (!usuarioEdicao && !senha) {
      setErro("Informe uma senha");
      return;
    }

    if (senha && senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (senha !== confirmarSenha && (senha || confirmarSenha)) {
      setErro("As senhas não coincidem");
      return;
    }

    const usuarios = JSON.parse(
      localStorage.getItem("usuarios") || "[]",
    ) as Usuario[];

    const emailExiste = usuarios.find(
      (u: Usuario) =>
        u.email === email &&
        (!usuarioEdicao || u.id !== usuarioEdicao.id),
    );

    if (emailExiste) {
      setErro("Este email já está cadastrado");
      return;
    }

    if (usuarioEdicao) {
      const atualizados = usuarios.map((u: Usuario) =>
        u.id === usuarioEdicao.id
          ? {
              ...u,
              nome,
              email,
              tipo,
              numeroConselho: tipo === "tecnico" ? numeroConselho : "",
              senha: senha ? senha : u.senha,
            }
          : u,
      );

      localStorage.setItem("usuarios", JSON.stringify(atualizados));

      const usuarioLogado = JSON.parse(
        localStorage.getItem("usuarioLogado") || "null",
      );

      if (usuarioLogado && usuarioLogado.id === usuarioEdicao.id) {
        localStorage.setItem(
          "usuarioLogado",
          JSON.stringify({
            ...usuarioLogado,
            nome,
            email,
            tipo,
          }),
        );
      }
    } else {
      const novoUsuario = {
        id: Date.now().toString(),
        nome,
        email,
        senha,
        tipo,
        numeroConselho: tipo === "tecnico" ? numeroConselho : "",
        dataCadastro: new Date().toISOString(),
      };

      usuarios.push(novoUsuario);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }

    if (onSalvar) onSalvar();
    onClose();
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.18),transparent_25%),rgba(15,23,42,0.8)] backdrop-blur-xl z-50">
      <div className="min-h-[calc(100vh-4rem)] flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[2rem] border-2 border-cyan-400/30 p-6 pb-8 shadow-[0_25px_80px_rgba(59,130,246,0.18)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_35px_120px_rgba(79,70,229,0.22)]">
          <div
            className="flex items-center justify-between mb-6 p-4 rounded-[1.4rem] border border-cyan-200/70 shadow-sm bg-gradient-to-r from-cyan-500 via-indigo-600 to-emerald-500"
          >
            <h2 className="text-white text-xl font-bold">
            {usuarioEdicao ? "Editar Perfil" : "Novo Usuário"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="text-white hover:bg-white/20 rounded-2xl p-2 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {erro && (
            <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold shadow-sm">
              {erro}
            </div>
          )}

          <div>
            <label htmlFor="nome-usuario" className="block text-slate-900 mb-2 font-semibold">
              Nome Completo
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-cyan-100 p-2 rounded-2xl shadow-sm">
                <User className="w-5 h-5 text-cyan-700" />
              </div>
              <input
                id="nome-usuario"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full pl-14 pr-4 py-3 bg-slate-50 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 shadow-sm transition duration-300 ease-out hover:border-cyan-300"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email-usuario" className="block text-slate-900 mb-2 font-semibold">
              Email
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-cyan-100 p-2 rounded-2xl shadow-sm">
                <Mail className="w-5 h-5 text-cyan-700" />
              </div>
              <input
                id="email-usuario"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-14 pr-4 py-3 bg-slate-50 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 shadow-sm transition duration-300 ease-out hover:border-cyan-300"
                required
              />
            </div>
          </div>

          {permitirEscolherTipo && (
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <label htmlFor="tipo-usuario" className="block text-slate-900 font-semibold">
                  Tipo de Usuário
                </label>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${tipoBadgeClasses}`}>
                  {tipo === "tecnico" ? "Técnico" : "Administrador"}
                </span>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-cyan-100 p-2 rounded-2xl shadow-sm z-10">
                  <Shield className="w-5 h-5 text-cyan-700" />
                </div>
                <select
                  id="tipo-usuario"
                  value={tipo}
                  onChange={(e) =>
                    setTipo(e.target.value as "adm" | "tecnico")
                  }
                  className={`w-full pl-14 pr-4 py-3 rounded-2xl border-2 ${tipoSelectClasses} focus:outline-none focus:ring-2 shadow-sm transition duration-300 ease-out hover:border-slate-300`}
                >
                  <option value="tecnico">Técnico</option>
                  <option value="adm">Administrador</option>
                </select>
              </div>
            </div>
          )}

          {tipo === "tecnico" && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl border-2 border-blue-300 shadow-sm">
              <label htmlFor="numero-conselho" className="block text-blue-900 mb-2 font-bold">
                Número do Conselho <span className="text-red-600">*</span>
              </label>
              <input
                id="numero-conselho"
                type="text"
                value={numeroConselho}
                onChange={(e) => setNumeroConselho(e.target.value)}
                placeholder="Ex: CREA-AM 123456"
                className="w-full px-4 py-3 bg-white rounded-2xl border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 shadow-sm transition duration-300 ease-out"
                required={tipo === "tecnico"}
              />
              <p className="text-xs text-blue-700 mt-2 font-medium">
                ℹ️ Este número aparecerá nos documentos gerados pelo técnico
              </p>
            </div>
          )}

          <div>
            <label htmlFor="senha-usuario" className="block text-slate-900 mb-2 font-semibold">
              {usuarioEdicao ? "Nova Senha (opcional)" : "Senha"}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-cyan-100 p-2 rounded-2xl shadow-sm">
                <Lock className="w-5 h-5 text-cyan-700" />
              </div>
              <input
                id="senha-usuario"
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full pl-14 pr-14 py-3 bg-slate-50 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 shadow-sm transition duration-300 ease-out hover:border-cyan-300"
              />
              <button
                type="button"
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-700 hover:text-cyan-900 bg-cyan-100 p-2 rounded-2xl hover:bg-cyan-200 transition-colors duration-200"
              >
                {mostrarSenha ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmar-senha-usuario" className="block text-slate-900 mb-2 font-semibold">
              Confirmar Senha
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-cyan-100 p-2 rounded-2xl shadow-sm">
                <Lock className="w-5 h-5 text-cyan-700" />
              </div>
              <input
                id="confirmar-senha-usuario"
                type={
                  mostrarConfirmarSenha ? "text" : "password"
                }
                value={confirmarSenha}
                onChange={(e) =>
                  setConfirmarSenha(e.target.value)
                }
                className="w-full pl-14 pr-14 py-3 bg-slate-50 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 shadow-sm transition duration-300 ease-out hover:border-cyan-300"
              />
              <button
                type="button"
                aria-label={mostrarConfirmarSenha ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
                onClick={() =>
                  setMostrarConfirmarSenha(
                    !mostrarConfirmarSenha,
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-700 hover:text-cyan-900 bg-cyan-100 p-2 rounded-2xl hover:bg-cyan-200 transition-colors duration-200"
              >
                {mostrarConfirmarSenha ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full text-white py-3.5 rounded-2xl font-bold shadow-2xl shadow-cyan-500/30 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(56,189,248,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none bg-gradient-to-r from-cyan-500 via-indigo-600 to-teal-500"
          >
            {usuarioEdicao ? "Salvar Alterações" : "Criar Usuário"}
          </button>
        </form>
      </div>
    </div>
  </div>
  );
}
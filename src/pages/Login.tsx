import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, LockKeyhole, Mail, ArrowRight } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError("Preencha seu usuário/e-mail e sua senha para continuar.");
      return;
    }
    // Fluxo demonstrativo: a autenticação real depende de um serviço/backend.
    sessionStorage.setItem("void-learning-user", identifier.trim());
    navigate("/dashboard");
  }

  return (
    <main className="login-screen">
      <div className="login-screen__shade" />
      <a className="login-brand" href="/login" aria-label="Void Learning - início">
        <span className="brand-tile"><img src="/images/logo-void.png" alt="" /></span>
        <span>Void <b>Learning</b></span>
      </a>

      <section className="login-card" aria-labelledby="login-title">
        <h1 id="login-title">Entrar</h1>
        <p className="login-description">Use o usuário ou e-mail da sua instituição.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label className="login-field">
            <span>Usuário ou e-mail</span>
            <div className="login-field__control">
              <Mail size={18} aria-hidden="true" />
              <input
                autoComplete="username"
                placeholder="Digite seu usuário ou e-mail"
                value={identifier}
                onChange={(event) => { setIdentifier(event.target.value); setError(""); }}
              />
            </div>
          </label>
          <label className="login-field">
            <span>Senha</span>
            <div className="login-field__control">
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                autoComplete="current-password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(event) => { setPassword(event.target.value); setError(""); }}
              />
              <button className="login-password-toggle" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
          <div className="login-options">
            <label><input type="checkbox" /> <span>Manter conectado</span></label>
            <button type="button" onClick={() => setError("Procure a secretaria acadêmica para redefinir sua senha.")}>Esqueceu a senha?</button>
          </div>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="login-submit" type="submit">Entrar <ArrowRight size={18} /></button>
        </form>
        <p className="login-footer">Ainda não tem acesso? <button type="button" onClick={() => setError("Entre em contato com a instituição para solicitar seu acesso.")}>Solicite seu cadastro</button></p>
        <p className="login-demo-note">Portal de demonstração: o login é ilustrativo.</p>
      </section>
      <p className="login-bottom-note">© 2026 Void Learning</p>
    </main>
  );
}

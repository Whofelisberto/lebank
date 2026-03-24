import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { useAuth } from '../context/AuthContext';
import lebankcapa from '../img/lebankcapa.jpg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Falha ao entrar. Verifique suas credenciais.');
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-100 via-slate-50 to-white flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden grid md:grid-cols-2">
          <div className="relative hidden md:block min-h-150">
            <img
              src={lebankcapa}
              alt="Capa LeBank"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-b from-indigo-950/20 via-indigo-900/40 to-indigo-950/70" />
            <div className="absolute -bottom-20 -right-14 w-72 h-72 rounded-full bg-violet-200/25 blur-3xl" />
            <div className="absolute -top-12 -left-10 w-56 h-56 rounded-full bg-indigo-300/20 blur-3xl" />
            <div className="absolute inset-x-8 bottom-10 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-100/95">LeBank</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight">Sua vida financeira em um único lugar.</h2>
              <p className="mt-3 text-sm text-indigo-100/90 max-w-sm">
                Acompanhe saldo, faça transferências e tenha controle total da sua conta digital.
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-8 md:p-10 lg:p-12">
            <div className="relative mb-6 overflow-hidden rounded-2xl border border-slate-200 md:hidden">
              <img
                src={lebankcapa}
                alt="Capa LeBank"
                className="h-36 w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-r from-indigo-900/60 to-indigo-700/20" />
              <p className="absolute left-4 bottom-3 text-white text-sm font-semibold tracking-wide">LeBank</p>
            </div>

            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mb-3">
                <span className="text-white font-bold text-lg">LB</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 text-center">Bem-vindo ao LeBank</h1>
              <p className="text-sm text-slate-500 mt-1 text-center">Entre na sua conta para continuar</p>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
              <InputField
                label="Senha"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" fullWidth isLoading={isLoading}>
                Entrar
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Não tem conta?{' '}
              <Link to="/registrar" className="text-indigo-600 font-medium hover:underline">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

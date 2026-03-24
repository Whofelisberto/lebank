import { CheckCircle2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ username: '', cpf: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  function handleChange(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const data = await register(form);
      setSuccess(data.account_number);
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Erro ao criar conta. Tente novamente.');
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-5 sm:p-8 w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 size={48} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Conta criada com sucesso!</h2>
          <p className="text-slate-500 text-sm mb-1">Seu número de conta é:</p>
          <p className="text-2xl font-mono font-bold text-indigo-700 mb-6">{success}</p>
          <Button fullWidth onClick={() => navigate('/login', { replace: true })}>
            Ir para o Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-5 sm:p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mb-3">
              <span className="text-white font-bold text-lg">LB</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Criar conta</h1>
            <p className="text-sm text-slate-500 mt-1 text-center">Preencha seus dados para começar</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Nome de usuário"
              type="text"
              placeholder="joaosilva"
              value={form.username}
              onChange={handleChange('username')}
              required
              autoFocus
            />
            <InputField
              label="CPF"
              type="text"
              placeholder="000.000.000-00"
              value={form.cpf}
              onChange={handleChange('cpf')}
              required
            />
            <InputField
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={handleChange('email')}
              required
            />
            <InputField
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange('password')}
              required
            />
            <Button type="submit" fullWidth isLoading={isLoading}>
              Criar conta
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Já tem conta?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

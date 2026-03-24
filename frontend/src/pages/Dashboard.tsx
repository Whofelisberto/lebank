import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, ChevronRight, CreditCard, Plus, Wallet, } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { accountApi } from '../api/account';
import { transactionApi } from '../api/transaction';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import StatCard from '../components/StatCard';
import TransactionForm from '../components/TransactionForm';
import TransactionItem from '../components/TransactionItem';
import { useAuth } from '../context/AuthContext';
import type { Account, Transaction } from '../types';

export default function Dashboard() {
  const { user } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  async function fetchData() {
    try {
      const { data: acc } = await accountApi.getMyAccount();
      setAccount(acc);
      const { data: tx } = await transactionApi.getByAccount(acc.id);
      setTransactions(tx.transactions.slice(0, 5));
    } catch {

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const totalDeposits = transactions
    .filter((t) => t.transaction_type === 'deposit')
    .reduce((s, t) => s + Number(t.amount), 0);

  const totalWithdrawals = transactions
    .filter((t) => t.transaction_type !== 'deposit')
    .reduce((s, t) => s + Number(t.amount), 0);

  const formatBRL = (n: number | string) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(n));

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Olá, {user?.username} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Aqui está o resumo da sua conta
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Nova transação
        </button>
      </div>


      {account && (
        <div className="bg-linear-to-r from-indigo-600 to-indigo-500 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
          <p className="text-indigo-200 text-sm font-medium mb-1">Saldo disponível</p>
          <p className="text-2xl sm:text-4xl font-bold tracking-tight wrap-break-word">{formatBRL(account.balance)}</p>
          <div className="grid grid-cols-1 gap-3 mt-4 pt-4 border-t border-indigo-400/40 sm:grid-cols-3 sm:gap-4">
            <div>
              <p className="text-indigo-200 text-xs">Número da conta</p>
              <p className="text-white font-mono font-semibold">{account.account_number}</p>
            </div>
            <div>
              <p className="text-indigo-200 text-xs">Tipo</p>
              <p className="text-white font-semibold capitalize">{account.type}</p>
            </div>
            <div>
              <p className="text-indigo-200 text-xs">ID da conta</p>
              <p className="text-white font-semibold">#{account.id}</p>
            </div>
          </div>
        </div>
      )}


      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Entradas (recentes)"
          value={formatBRL(totalDeposits)}
          icon={ArrowDownLeft}
          color="emerald"
        />
        <StatCard
          label="Saídas (recentes)"
          value={formatBRL(totalWithdrawals)}
          icon={ArrowUpRight}
          color="rose"
        />
        <StatCard
          label="Conta"
          value={account?.account_number ?? '—'}
          sub={`Tipo: ${account?.type ?? '—'}`}
          icon={CreditCard}
          color="indigo"
        />
      </div>


      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          {
            icon: ArrowDownLeft,
            label: 'Depositar',
            iconBg: 'bg-emerald-50',
            iconText: 'text-emerald-600',
          },
          {
            icon: ArrowUpRight,
            label: 'Sacar',
            iconBg: 'bg-rose-50',
            iconText: 'text-rose-600',
          },
          {
            icon: ArrowLeftRight,
            label: 'Transferir',
            iconBg: 'bg-amber-50',
            iconText: 'text-amber-600',
          },
        ].map(({ icon: Icon, label, iconBg, iconText }) => (
          <button
            key={label}
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center sm:flex-col sm:items-center gap-2 py-3.5 sm:py-4 px-3 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-all text-sm font-medium text-slate-700"
          >
            <div className={`p-2.5 rounded-xl ${iconBg} ${iconText}`}>
              <Icon size={18} />
            </div>
            {label}
          </button>
        ))}
      </div>


      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Wallet size={18} className="text-indigo-500" />
            <h2 className="text-sm font-semibold text-slate-700">Transações recentes</h2>
          </div>
          <Link
            to="/transactions"
            className="flex items-center gap-1 text-xs text-indigo-600 font-medium hover:underline"
          >
            Ver todas
            <ChevronRight size={14} />
          </Link>
        </div>

        {transactions.length === 0 ? (
          <div className="px-5 py-10 text-center text-slate-400 text-sm">
            Nenhuma transação encontrada.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </div>
        )}
      </div>


      <Modal title="Nova Transação" isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {account && (
          <TransactionForm
            accountId={account.id}
            onSuccess={() => {
              setModalOpen(false);
              fetchData();
            }}
          />
        )}
      </Modal>
    </div>
  );
}

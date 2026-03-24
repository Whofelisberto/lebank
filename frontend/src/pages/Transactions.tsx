import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Filter, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { accountApi } from '../api/account';
import { transactionApi } from '../api/transaction';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import TransactionForm from '../components/TransactionForm';
import TransactionItem from '../components/TransactionItem';
import type { Account, Transaction, TransactionType } from '../types';

const filterOptions: { value: TransactionType | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'deposit', label: 'Depósitos' },
  { value: 'withdrawal', label: 'Saques' },
  { value: 'transfer', label: 'Transferências' },
];

export default function Transactions() {
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TransactionType | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);

  async function fetchData() {
    setLoading(true);
    try {
      const { data: acc } = await accountApi.getMyAccount();
      setAccount(acc);
      const { data: tx } = await transactionApi.getByAccount(acc.id);
      setTransactions(tx.transactions);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(
    () =>
      filter === 'all'
        ? transactions
        : transactions.filter((t) => t.transaction_type === filter),
    [transactions, filter]
  );

  const formatBRL = (n: number | string) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(n));


  const summary = {
    deposit: transactions
      .filter((t) => t.transaction_type === 'deposit')
      .reduce((s, t) => s + Number(t.amount), 0),
    withdrawal: transactions
      .filter((t) => t.transaction_type === 'withdrawal')
      .reduce((s, t) => s + Number(t.amount), 0),
    transfer: transactions
      .filter((t) => t.transaction_type === 'transfer')
      .reduce((s, t) => s + Number(t.amount), 0),
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Transações</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Histórico completo de movimentações
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


      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-emerald-50">
              <ArrowDownLeft size={14} className="text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-slate-500">Depósitos</span>
          </div>
          <p className="text-lg font-bold text-emerald-600">{formatBRL(summary.deposit)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-rose-50">
              <ArrowUpRight size={14} className="text-rose-600" />
            </div>
            <span className="text-xs font-medium text-slate-500">Saques</span>
          </div>
          <p className="text-lg font-bold text-rose-600">{formatBRL(summary.withdrawal)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-amber-50">
              <ArrowLeftRight size={14} className="text-amber-600" />
            </div>
            <span className="text-xs font-medium text-slate-500">Transferências</span>
          </div>
          <p className="text-lg font-bold text-amber-600">{formatBRL(summary.transfer)}</p>
        </div>
      </div>


      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 px-4 sm:px-5 py-4 border-b border-slate-100">
          <Filter size={15} className="text-slate-400" />
          <span className="text-xs font-medium text-slate-500 mr-2">Filtrar:</span>
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === opt.value
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
          <span className="w-full sm:w-auto sm:ml-auto text-xs text-slate-400">
            {filtered.length} registros
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            Nenhuma transação encontrada.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((tx) => (
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

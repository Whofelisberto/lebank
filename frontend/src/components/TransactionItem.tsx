import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight } from 'lucide-react';
import type { Transaction } from '../types';

interface Props {
  transaction: Transaction;
}

const config = {
  deposit: {
    label: 'Depósito',
    icon: ArrowDownLeft,
    amountClass: 'text-emerald-600',
    iconClass: 'bg-emerald-50 text-emerald-600',
    prefix: '+',
  },
  withdrawal: {
    label: 'Saque',
    icon: ArrowUpRight,
    amountClass: 'text-rose-600',
    iconClass: 'bg-rose-50 text-rose-600',
    prefix: '-',
  },
  transfer: {
    label: 'Transferência',
    icon: ArrowLeftRight,
    amountClass: 'text-amber-600',
    iconClass: 'bg-amber-50 text-amber-600',
    prefix: '-',
  },
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

function formatBRL(value: string) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value));
}

export default function TransactionItem({ transaction }: Props) {
  const { transaction_type, amount, created_at, target_account_id } = transaction;
  const { label, icon: Icon, amountClass, iconClass, prefix } = config[transaction_type];

  return (
    <div className="flex items-start gap-3 py-3.5 px-4 hover:bg-slate-50 rounded-xl transition-colors sm:items-center sm:gap-4">
      <div className={`p-2.5 rounded-xl ${iconClass}`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">
          {created_at ? formatDate(created_at) : '—'}
          {target_account_id ? (
            <span className="ml-2 text-slate-500">→ conta #{target_account_id}</span>
          ) : null}
        </p>
      </div>
      <span className={`text-sm font-semibold ${amountClass} whitespace-nowrap`}>
        {prefix} {formatBRL(amount)}
      </span>
    </div>
  );
}

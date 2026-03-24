import { useState, type FormEvent } from 'react';
import { transactionApi } from '../api/transaction';
import type { TransactionType } from '../types';
import Button from './Button';
import InputField from './InputField';

interface Props {
  accountId: number;
  onSuccess: () => void;
}

const types: { value: TransactionType; label: string }[] = [
  { value: 'deposit', label: '💰 Depósito' },
  { value: 'withdrawal', label: '💸 Saque' },
  { value: 'transfer', label: '🔄 Transferência' },
];

export default function TransactionForm({ accountId, onSuccess }: Props) {
  const [type, setType] = useState<TransactionType>('deposit');
  const [amount, setAmount] = useState('');
  const [targetId, setTargetId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await transactionApi.create({
        account_id: accountId,
        transaction_type: type,
        amount: parseFloat(amount),
        ...(type === 'transfer' ? { target_account_id: parseInt(targetId) } : {}),
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Erro ao realizar transação.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Tipo de transação
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {types.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setType(value)}
              className={`py-2.5 px-2 rounded-xl border text-xs font-medium transition-colors text-center ${
                type === value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <InputField
        label="Valor (R$)"
        type="number"
        min="0.01"
        step="0.01"
        placeholder="0,00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      {type === 'transfer' && (
        <InputField
          label="ID da conta de destino"
          type="number"
          placeholder="Ex: 3"
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
          required
        />
      )}

      {error && (
        <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
          {error}
        </div>
      )}

      <Button type="submit" fullWidth isLoading={loading}>
        Confirmar
      </Button>
    </form>
  );
}

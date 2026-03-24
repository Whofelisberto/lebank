import type { Transaction, TransactionPayload } from '../types';
import api from './axios';

interface TransactionsResponse {
  account_id: number;
  transactions: Transaction[];
}

export const transactionApi = {
  getByAccount: (accountId: number) =>
    api.get<TransactionsResponse>(`/get-transaction/${accountId}`),

  create: (payload: TransactionPayload) =>
    api.post('/criar-transaction', payload),
};

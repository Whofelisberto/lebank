
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  cpf: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  User: AuthUser;
}

export interface Account {
  id: number;
  account_number: string;
  user_id: number;
  username: string;
  balance: string;
  type: string;
  created_at: string;
}


export type TransactionType = 'deposit' | 'withdrawal' | 'transfer';

export interface Transaction {
  id: number;
  account_id: number;
  target_account_id: number | null;
  amount: string;
  transaction_type: TransactionType;
  created_at: string;
}

export interface TransactionPayload {
  account_id: number;
  transaction_type: TransactionType;
  amount: number;
  target_account_id?: number;
}

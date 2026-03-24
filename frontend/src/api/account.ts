import type { Account } from '../types';
import api from './axios';

export const accountApi = {
  getMyAccount: () =>
    api.get<Account>('/my-account'),
};

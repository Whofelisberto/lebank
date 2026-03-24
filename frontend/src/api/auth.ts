import type { LoginPayload, LoginResponse, RegisterPayload } from '../types';
import api from './axios';

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<LoginResponse>('/login', payload),

  register: (payload: RegisterPayload) =>
    api.post('/registrar', payload),

  logout: () =>
    api.post('/logout'),

  me: () =>
    api.get('/me'),
};

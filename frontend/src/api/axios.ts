import axios from 'axios';

const api = axios.create({
  baseURL: "http://127.0.0.1:5000",
  headers: { 'Content-Type': 'application/json' },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lebank_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lebank_token');
      localStorage.removeItem('lebank_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';
import { useAuthStore } from '../store/auth';

const api = axios.create({
  //baseURL: 'http://localhost:8201/api'
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
/*
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});*/

export default api;

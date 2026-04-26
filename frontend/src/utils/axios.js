import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://10.26.154.129:3000';

const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add token to headers
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;

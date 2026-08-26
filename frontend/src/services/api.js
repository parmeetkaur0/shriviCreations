import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://shrivi.onrender.com/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token from localStorage (in addition to httpOnly cookie support)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
    return Promise.reject({ ...error, message });
  }
);

export default api;

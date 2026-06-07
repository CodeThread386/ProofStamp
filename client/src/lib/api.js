import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const PUBLIC_AUTH_PATHS = ['/login', '/auth/callback'];

function isPublicAuthRoute() {
  const path = window.location.pathname;
  return PUBLIC_AUTH_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 && !isPublicAuthRoute()) {
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;

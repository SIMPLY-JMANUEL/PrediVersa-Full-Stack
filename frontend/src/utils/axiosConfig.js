import axios from 'axios';

// Crear instancia de axios con configuración
const baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5003';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Bandera para evitar múltiples renovaciones simultáneas
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  isRefreshing = false;
  failedQueue = [];
};

// Interceptor de respuesta para manejar errores 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const token = localStorage.getItem('token');

      if (!token) {
        // Sin token, redirigir a login
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      return axios
        .post(`${baseURL}/api/auth/refresh`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => {
          const { token: newToken } = data;
          localStorage.setItem('token', newToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return api(originalRequest);
        })
        .catch((err) => {
          processQueue(err, null);
          localStorage.removeItem('token');
          window.location.href = '/login';
          return Promise.reject(err);
        });
    }

    return Promise.reject(error);
  }
);

// Interceptor de petición para incluir token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

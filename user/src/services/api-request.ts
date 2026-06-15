import axios from 'axios';
import Cookies from 'js-cookie';

const API_ENDPOINT =
  typeof window !== 'undefined'
    ? '/api-backend'
    : process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:5001';

export const TOKEN_KEY = 'user_token';

const apiRequest = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

function generateRequestId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    try {
      return (crypto as any).randomUUID();
    } catch {
      /* noop */
    }
  }
  return `req-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

apiRequest.interceptors.request.use((config) => {
  const token = Cookies.get(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (!config.headers['x-request-id']) {
    config.headers['x-request-id'] = generateRequestId();
  }
  return config;
});

apiRequest.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Có lỗi xảy ra';

    if (error.response?.status === 401) {
      Cookies.remove(TOKEN_KEY, { path: '/' });
      if (typeof window !== 'undefined' && window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login';
      }
    }

    try {
      const status = error.response?.status;
      const url: string = error.config?.url || '';
      if (status && !url.includes('/logs/client-error')) {
        import('@lib/client-error-reporter')
          .then(({ reportClientError }) => {
            reportClientError({
              level: status >= 500 ? 'error' : 'warn',
              message: `API ${error.config?.method?.toUpperCase()} ${url} -> ${status}: ${message}`,
              metadata: {
                kind: 'api_error',
                status,
                url,
                requestId: error.config?.headers?.['x-request-id'],
                responseRequestId: error.response?.headers?.['x-request-id']
              }
            });
          })
          .catch(() => undefined);
      }
    } catch {
      /* noop */
    }

    return Promise.reject(new Error(message));
  }
);

export { apiRequest };

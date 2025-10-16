import axios, { AxiosError } from 'axios';
import { token } from './token';

const baseURL = import.meta.env.VITE_API_BASE_URL as string;

export const api = axios.create({
  baseURL,
  withCredentials: true, // refresh token cookie
});

// Attach access token
api.interceptors.request.use((config) => {
  const t = token.get();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const p = (async () => {
    try {
      const res = await api.post<{ accessToken: string }>('/users/refresh-token');
      const newToken = res.data?.accessToken;
      if (newToken) token.set(newToken);
      return newToken ?? null;
    } catch (e) {
      token.clear();
      return null;
    } finally {
      refreshing = null;
    }
  })();
  refreshing = p;
  return p;
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as any;
    const status = error.response?.status;
    if (status === 401 && !original?._retry) {
      original._retry = true;
      try {
        const newTok = refreshing ?? refreshAccessToken();
        const t = await newTok;
        if (!t) return Promise.reject(error);
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${t}`;
        return api(original);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export function normalizeError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const msg = (err.response?.data as any)?.message ?? err.message;
    return typeof msg === 'string' ? msg : 'Unexpected error';
  }
  return 'Unexpected error';
}

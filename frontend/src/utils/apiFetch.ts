import { triggerLogout } from './logoutBridge';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api';

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('tf_token');
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> | undefined ?? {}),
    },
  });

  if (res.status === 401) {
    triggerLogout();
  }

  const json = await res.json() as T;
  if (!res.ok) {
    throw new Error((json as { message?: string }).message ?? 'Request failed');
  }
  return json;
}

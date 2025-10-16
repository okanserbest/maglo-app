import { api } from '../../lib/api';
import type { LoginResponse, RegisterResponse, User } from '../../types/auth';

export async function register(data: { fullName: string; email: string; password: string }) {
  const res = await api.post<RegisterResponse>('/users/register', data);
  return res.data;
}

export async function login(data: { email: string; password: string }) {
  const res = await api.post<LoginResponse>('/users/login', data);
  return res.data;
}

export async function logout() {
  await api.post('/users/logout');
}

export async function getProfile() {
  const res = await api.get<User>('/users/profile');
  return res.data;
}

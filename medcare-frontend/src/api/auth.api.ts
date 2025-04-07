// src/api/auth.api.ts
import api from './api';

export const login = (username: string, password: string) => {
  return api.post('/auth/login', { username, password });
};
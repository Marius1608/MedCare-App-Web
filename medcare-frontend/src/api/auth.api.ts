import api from './api';

export const login = (username: string, password: string) => {
  return api.post('/auth/login', { username, password });
};

export const validateToken = () => {
  return api.get('/auth/validate');
};
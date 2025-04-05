// src/api/user.api.ts
import api from './api';
import { User } from '../types/user.types';

export const getAllUsers = () => {
  return api.get('/users');
};

export const getUserById = (id: number) => {
  return api.get(`/users/${id}`);
};

export const createUser = (userData: Partial<User>) => {
  return api.post('/users', userData);
};

export const updateUser = (id: number, userData: Partial<User>) => {
  return api.put(`/users/${id}`, userData);
};

export const deleteUser = (id: number) => {
  return api.delete(`/users/${id}`);
};
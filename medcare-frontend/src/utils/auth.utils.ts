// src/utils/auth.utils.ts
import { User, UserRole } from '../types/user.types';

export const getStoredUser = (): User | null => {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) return null;
  
  try {
    return JSON.parse(storedUser) as User;
  } catch (error) {
    return null;
  }
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem('token');
};


export const storeUserAndToken = (user: User, token: string): void => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
};


export const clearUserAndToken = (): void => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};


export const hasRole = (user: User | null, roles: UserRole[]): boolean => {
  if (!user) return false;
  return roles.includes(user.role);
};


export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000; 
    return Date.now() >= expiryTime;
  } catch (error) {
    return true;
  }
};


export const parseToken = (token: string): any | null => {
  if (!token) return null;
  
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    return null;
  }
};
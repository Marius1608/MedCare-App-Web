// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { login as apiLogin } from '../api/auth.api';

// Define a user type
interface User {
  id: number;
  username: string;
  name: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiLogin(username, password);
      const { token, id, name, role } = response.data;
      
      const userData: User = { id, username, name, role };
      
      setUser(userData);
      setToken(token);
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      return userData;
    } catch (err: any) {
      setError(err.response?.data || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  return { 
    user, 
    token, 
    loading, 
    error, 
    login, 
    logout, 
    isAuthenticated: !!token,
    isAdmin: user?.role === 'ADMIN'
  };
}

export default useAuth;
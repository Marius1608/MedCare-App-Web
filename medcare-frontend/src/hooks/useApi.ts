// src/hooks/useApi.ts
import { useState, useCallback } from 'react';
import { AxiosResponse, AxiosError } from 'axios';
import useAuth from './useAuth';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiActions<T> {
  execute: (...args: any[]) => Promise<AxiosResponse<T> | void>;
  reset: () => void;
}

interface ErrorResponse {
  message?: string;
  [key: string]: any;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<AxiosResponse<T>>,
  initialData: T | null = null
): [ApiState<T>, ApiActions<T>] {
  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const { logout } = useAuth();

  const execute = useCallback(
    async (...args: any[]): Promise<AxiosResponse<T> | void> => {
      setState((prevState) => ({
        ...prevState,
        loading: true,
        error: null,
      }));

      try {
        const response = await apiFunction(...args);
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
        return response;
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        
        // Check if error is a 401 (Unauthorized)
        if (error.response?.status === 401) {
          logout();
          setState({
            data: null,
            loading: false,
            error: 'Your session has expired. Please log in again.',
          });
        } else {
          setState({
            data: null,
            loading: false,
            error: error.response?.data?.message || 'An unexpected error occurred',
          });
        }
      }
    },
    [apiFunction, logout]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
    });
  }, [initialData]);

  return [state, { execute, reset }];
}

export default useApi;
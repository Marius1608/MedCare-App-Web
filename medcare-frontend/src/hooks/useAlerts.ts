// src/hooks/useAlerts.ts
import { useContext } from 'react';
import AlertContext from '../contexts/AlertContext';

export const useAlerts = () => useContext(AlertContext);

export default useAlerts;
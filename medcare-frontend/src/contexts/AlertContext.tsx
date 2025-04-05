// src/contexts/AlertContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import { Alert, AlertColor, Snackbar } from '@mui/material';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertMessage {
  type: AlertType;
  message: string;
}

interface AlertContextType {
  showAlert: (type: AlertType, message: string) => void;
  closeAlert: () => void;
}

export const AlertContext = createContext<AlertContextType>({
  showAlert: () => {},
  closeAlert: () => {},
});

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);

  const showAlert = (type: AlertType, message: string) => {
    setAlertMessage({ type, message });
    setOpen(true);
  };

  const closeAlert = () => {
    setOpen(false);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <AlertContext.Provider value={{ showAlert, closeAlert }}>
      {children}
      {alertMessage && (
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleClose} severity={alertMessage.type as AlertColor} sx={{ width: '100%' }}>
            {alertMessage.message}
          </Alert>
        </Snackbar>
      )}
    </AlertContext.Provider>
  );
};

export default AlertContext;
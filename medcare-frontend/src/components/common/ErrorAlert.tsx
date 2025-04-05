// src/components/common/ErrorAlert.tsx
import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';

interface ErrorAlertProps {
  message: string;
  title?: string;
  onClose?: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, title, onClose }) => {
  return (
    <Box sx={{ my: 2 }}>
      <Alert severity="error" onClose={onClose}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Box>
  );
};

export default ErrorAlert;
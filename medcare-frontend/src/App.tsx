// src/App.tsx
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { routes } from './routes';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme';

function App() {
  const routing = useRoutes(routes);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <AuthProvider>
          {routing}
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
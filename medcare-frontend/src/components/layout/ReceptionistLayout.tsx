// src/components/layout/ReceptionistLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import MainLayout from './MainLayout';

const ReceptionistLayout: React.FC = () => {
  return (
    <Box>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ py: 2 }}>
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
};

export default ReceptionistLayout;
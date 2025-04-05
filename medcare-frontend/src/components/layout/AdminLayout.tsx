// src/components/layout/AdminLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';

const AdminLayout: React.FC = () => {
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

export default AdminLayout;
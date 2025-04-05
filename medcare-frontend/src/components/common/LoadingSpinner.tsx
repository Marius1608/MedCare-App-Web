// src/components/common/LoadingSpinner.tsx
import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen = false, size = 40 }) => {
  if (fullScreen) {
    return (
      <Box 
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <CircularProgress size={size} />
      </Box>
    );
  }

  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
};

export default LoadingSpinner;
// src/components/common/StatsCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Box, Icon, styled } from '@mui/material';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  },
}));

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color = 'primary.main' }) => {
  return (
    <StyledCard>
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mb: 1
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${color}20`,
              color: color,
              mb: 2,
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" component="div" fontWeight="bold">
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default StatsCard;
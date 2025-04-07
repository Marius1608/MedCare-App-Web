// src/components/common/StyledDataGrid.tsx
import React from 'react';
import { 
  DataGrid, 
  GridColDef, 
  DataGridProps,
  gridClasses
} from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

const StyledGrid = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: theme.palette.primary.light + '15', 
    borderRadius: theme.shape.borderRadius,
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 600,
  },
  '& .MuiDataGrid-cell': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiDataGrid-row': {
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  '& .MuiDataGrid-row:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover + '40',
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: 'none',
  },
  '& .MuiDataGrid-virtualScroller': {
    backgroundColor: theme.palette.background.paper,
  },
  [`& .${gridClasses.row}.Mui-selected`]: {
    backgroundColor: theme.palette.primary.light + '30',
    '&:hover': {
      backgroundColor: theme.palette.primary.light + '40',
    },
  },
}));

interface StyledDataGridProps extends DataGridProps {
  heightOffset?: number;
}

const StyledDataGrid: React.FC<StyledDataGridProps> = ({ heightOffset = 220, ...props }) => {
  return (
    <StyledGrid
      autoHeight
      disableRowSelectionOnClick
      pageSizeOptions={[5, 10, 25]}
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
      }}
      sx={{ 
        ...props.sx,
        height: `calc(100vh - ${heightOffset}px)` 
      }}
      {...props}
    />
  );
};

export default StyledDataGrid;
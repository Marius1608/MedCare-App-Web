// src/components/service/ServiceList.tsx
import React from 'react';
import { 
  Box, 
  IconButton, 
  Paper, 
  Tooltip
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { MedicalService } from '../../types/service.types';

interface ServiceListProps {
  services: MedicalService[];
  loading: boolean;
  onEdit: (service: MedicalService) => void;
  onDelete: (service: MedicalService) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ services, loading, onEdit, onDelete }) => {
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Service Name', width: 250 },
    { 
      field: 'price', 
      headerName: 'Price', 
      width: 120,
      valueFormatter: (params) => `$${params.value}`,
    },
    { 
      field: 'duration', 
      headerName: 'Duration', 
      width: 120,
      valueFormatter: (params) => `${params.value} min`,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton
              color="primary"
              size="small"
              onClick={() => onEdit(params.row as MedicalService)}
              sx={{ mr: 1 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Delete">
            <IconButton
              color="error"
              size="small"
              onClick={() => onDelete(params.row as MedicalService)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Paper sx={{ p: 2, height: 'calc(100vh - 220px)' }}>
      <DataGrid
        rows={services}
        columns={columns}
        loading={loading}
        pagination
        autoHeight
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
      />
    </Paper>
  );
};

export default ServiceList;
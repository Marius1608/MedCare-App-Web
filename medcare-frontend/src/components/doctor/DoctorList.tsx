// src/components/doctor/DoctorList.tsx
import React from 'react';
import { 
  Box, 
  Button, 
  IconButton, 
  Paper, 
  Typography,
  Tooltip
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Doctor } from '../../types/doctor.types';

interface DoctorListProps {
  doctors: Doctor[];
  loading: boolean;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}

const DoctorList: React.FC<DoctorListProps> = ({ doctors, loading, onEdit, onDelete }) => {
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'specialization', headerName: 'Specialization', width: 200 },
    { 
      field: 'workHours', 
      headerName: 'Working Hours', 
      width: 150,
      valueGetter: (params) => params.row.workHours || '' 
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
              onClick={() => onEdit(params.row as Doctor)}
              sx={{ mr: 1 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Delete">
            <IconButton
              color="error"
              size="small"
              onClick={() => onDelete(params.row as Doctor)}
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
        rows={doctors}
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

export default DoctorList;
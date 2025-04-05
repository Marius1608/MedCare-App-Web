// src/pages/admin/DoctorManagement.tsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { getAllDoctors, deleteDoctor } from '../../api/doctor.api';
import DoctorForm from '../../components/doctor/DoctorForm';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Doctor } from '../../types/doctor.types';

const DoctorManagement: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await getAllDoctors();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setAlertMessage({ type: 'error', message: 'Failed to load doctors. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setIsFormOpen(true);
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedDoctor) {
      try {
        await deleteDoctor(selectedDoctor.id);
        setIsDeleteDialogOpen(false);
        fetchDoctors();
        setAlertMessage({ type: 'success', message: 'Doctor deleted successfully!' });
      } catch (error) {
        console.error('Error deleting doctor:', error);
        setAlertMessage({ type: 'error', message: 'Failed to delete doctor.' });
      }
    }
  };

  const handleFormClose = (refresh: boolean = false) => {
    setIsFormOpen(false);
    if (refresh) {
      fetchDoctors();
    }
  };

  const handleAlertClose = () => {
    setAlertMessage(null);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'specialization', headerName: 'Specialization', width: 200 },
    { field: 'workHours', headerName: 'Working Hours', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleEditDoctor(params.row as Doctor)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDeleteClick(params.row as Doctor)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="h2">
          Doctor Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddDoctor}
        >
          Add Doctor
        </Button>
      </Paper>

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

      {isFormOpen && (
        <DoctorForm
          open={isFormOpen}
          doctor={selectedDoctor}
          onClose={handleFormClose}
        />
      )}

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Doctor"
        content={`Are you sure you want to delete the doctor "${selectedDoctor?.name}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />

      <Snackbar
        open={alertMessage !== null}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {alertMessage ? (
          <Alert onClose={handleAlertClose} severity={alertMessage.type} sx={{ width: '100%' }}>
            {alertMessage.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
};

export default DoctorManagement;
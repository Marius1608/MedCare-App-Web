// src/pages/admin/ServiceManagement.tsx
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
import { getAllMedicalServices, deleteMedicalService } from '../../api/service.api';
import ServiceForm from '../../components/service/ServiceForm';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { MedicalService } from '../../types/service.types';

const ServiceManagement: React.FC = () => {
  const [services, setServices] = useState<MedicalService[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<MedicalService | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await getAllMedicalServices();
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching medical services:', error);
      setAlertMessage({ type: 'error', message: 'Failed to load medical services. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddService = () => {
    setSelectedService(null);
    setIsFormOpen(true);
  };

  const handleEditService = (service: MedicalService) => {
    setSelectedService(service);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (service: MedicalService) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedService) {
      try {
        await deleteMedicalService(selectedService.id);
        setIsDeleteDialogOpen(false);
        fetchServices();
        setAlertMessage({ type: 'success', message: 'Medical service deleted successfully!' });
      } catch (error) {
        console.error('Error deleting medical service:', error);
        setAlertMessage({ type: 'error', message: 'Failed to delete medical service.' });
      }
    }
  };

  const handleFormClose = (refresh: boolean = false) => {
    setIsFormOpen(false);
    if (refresh) {
      fetchServices();
    }
  };

  const handleAlertClose = () => {
    setAlertMessage(null);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Service Name', width: 300 },
    { 
      field: 'price', 
      headerName: 'Price ($)', 
      width: 150,
      valueFormatter: (params) => {
        return params.value ? `$${params.value.toFixed(2)}` : '';
      }
    },
    { 
      field: 'duration', 
      headerName: 'Duration (min)', 
      width: 150 
    },
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
            onClick={() => handleEditService(params.row as MedicalService)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDeleteClick(params.row as MedicalService)}
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
          Medical Service Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddService}
        >
          Add Service
        </Button>
      </Paper>

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

      {isFormOpen && (
        <ServiceForm
          open={isFormOpen}
          service={selectedService}
          onClose={handleFormClose}
        />
      )}

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Medical Service"
        content={`Are you sure you want to delete the medical service "${selectedService?.name}"?`}
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

export default ServiceManagement;
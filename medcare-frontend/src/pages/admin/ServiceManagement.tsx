// src/pages/admin/ServiceManagement.tsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { getAllMedicalServices, deleteMedicalService } from '../../api/service.api';
import ServiceForm from '../../components/service/ServiceForm';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { MedicalService } from '../../types/service.types';
import StyledDataGrid from '../../components/common/StyledDataGrid';

const ServiceManagement: React.FC = () => {
  const theme = useTheme();
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
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500} sx={{ color: theme.palette.success.dark }}>
          ${params.value?.toFixed(2)}
        </Typography>
      )
    },
    { 
      field: 'duration', 
      headerName: 'Duration (min)', 
      width: 140,
      renderCell: (params) => (
        <Box sx={{ 
          bgcolor: theme.palette.info.light + '15',
          color: theme.palette.info.dark,
          py: 0.5,
          px: 1.5,
          borderRadius: 1,
          fontWeight: 500,
          fontSize: '0.8125rem'
        }}>
          {params.value} min
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleEditService(params.row as MedicalService)}
              sx={{ mr: 1 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              size="small"
              onClick={() => handleDeleteClick(params.row as MedicalService)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" component="h1" fontWeight="bold">
            Medical Services
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage the services provided by your medical facility
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddService}
          sx={{ borderRadius: 2, px: 3 }}
        >
          Add Service
        </Button>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <StyledDataGrid
          rows={services}
          columns={columns}
          loading={loading}
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
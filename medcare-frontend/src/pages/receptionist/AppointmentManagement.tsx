import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { format, parseISO } from 'date-fns';
import { 
  getAllAppointments, 
  updateAppointmentStatus, 
  deleteAppointment 
} from '../../api/appointment.api';
import AppointmentForm from '../../components/appointment/AppointmentForm';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Appointment, AppointmentStatus } from '../../types/appointment.types';

const AppointmentManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await getAllAppointments();
      setAppointments(response.data);
      filterAppointments(response.data, tabValue);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAlertMessage({ type: 'error', message: 'Failed to load appointments. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filterAppointments = (appointments: Appointment[], tabIndex: number) => {
    switch (tabIndex) {
      case 0: // All
        setFilteredAppointments(appointments);
        break;
      case 1: // New
        setFilteredAppointments(appointments.filter(a => a.status === AppointmentStatus.NEW));
        break;
      case 2: // In Progress
        setFilteredAppointments(appointments.filter(a => a.status === AppointmentStatus.IN_PROGRESS));
        break;
      case 3: // Completed
        setFilteredAppointments(appointments.filter(a => a.status === AppointmentStatus.COMPLETED));
        break;
      default:
        setFilteredAppointments(appointments);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    filterAppointments(appointments, newValue);
  };

  const handleAddAppointment = () => {
    setSelectedAppointment(null);
    setIsFormOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleUpdateStatus = async (appointment: Appointment, newStatus: AppointmentStatus) => {
    try {
      await updateAppointmentStatus(appointment.id!, newStatus);
      setAlertMessage({ type: 'success', message: 'Appointment status updated successfully!' });
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      setAlertMessage({ type: 'error', message: 'Failed to update appointment status.' });
    }
  };

  const handleDeleteClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedAppointment) {
      try {
        await deleteAppointment(selectedAppointment.id!);
        setIsDeleteDialogOpen(false);
        fetchAppointments();
        setAlertMessage({ type: 'success', message: 'Appointment deleted successfully!' });
      } catch (error) {
        console.error('Error deleting appointment:', error);
        setAlertMessage({ type: 'error', message: 'Failed to delete appointment.' });
      }
    }
  };

  const handleFormClose = (refresh: boolean = false) => {
    setIsFormOpen(false);
    if (refresh) {
      fetchAppointments();
    }
  };

  const handleAlertClose = () => {
    setAlertMessage(null);
  };

  const getStatusChip = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.NEW:
        return <Chip label="New" color="info" size="small" />;
      case AppointmentStatus.IN_PROGRESS:
        return <Chip label="In Progress" color="warning" size="small" />;
      case AppointmentStatus.COMPLETED:
        return <Chip label="Completed" color="success" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'patientName', headerName: 'Patient', width: 150 },
    { 
      field: 'doctor', 
      headerName: 'Doctor', 
      width: 150,
      valueGetter: (params) => params.row.doctor?.name || '',
    },
    { 
      field: 'specialization', 
      headerName: 'Specialization', 
      width: 150,
      valueGetter: (params) => params.row.doctor?.specialization || '',
    },
    {
      field: 'dateTime',
      headerName: 'Date & Time',
      width: 170,
      valueGetter: (params) => {
        if (!params.row.dateTime) return '';
        try {
          return format(parseISO(params.row.dateTime), 'dd/MM/yyyy HH:mm');
        } catch (e) {
          return params.row.dateTime;
        }
      },
    },
    {
      field: 'service',
      headerName: 'Service',
      width: 170,
      valueGetter: (params) => params.row.service?.name || '',
    },
    {
      field: 'duration',
      headerName: 'Duration',
      width: 100,
      valueGetter: (params) => params.row.service?.duration ? `${params.row.service.duration} min` : '',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params: GridRenderCellParams) => getStatusChip(params.row.status),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const appointment = params.row as Appointment;
        return (
          <Box>
            {appointment.status === AppointmentStatus.NEW && (
              <Tooltip title="Start Appointment">
                <IconButton
                  color="warning"
                  size="small"
                  onClick={() => handleUpdateStatus(appointment, AppointmentStatus.IN_PROGRESS)}
                >
                  <PlayArrowIcon />
                </IconButton>
              </Tooltip>
            )}
            
            {appointment.status === AppointmentStatus.IN_PROGRESS && (
              <Tooltip title="Complete Appointment">
                <IconButton
                  color="success"
                  size="small"
                  onClick={() => handleUpdateStatus(appointment, AppointmentStatus.COMPLETED)}
                >
                  <CheckCircleIcon />
                </IconButton>
              </Tooltip>
            )}
            
            <Tooltip title="Edit Appointment">
              <IconButton
                color="primary"
                size="small"
                onClick={() => handleEditAppointment(appointment)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Delete Appointment">
              <IconButton
                color="error"
                size="small"
                onClick={() => handleDeleteClick(appointment)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="h2">
          Appointment Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddAppointment}
        >
          New Appointment
        </Button>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="appointment tabs">
          <Tab label="All Appointments" />
          <Tab label="New" />
          <Tab label="In Progress" />
          <Tab label="Completed" />
        </Tabs>
      </Paper>

      <Paper sx={{ p: 2, height: 'calc(100vh - 270px)' }}>
        <DataGrid
          rows={filteredAppointments}
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
        <AppointmentForm
          open={isFormOpen}
          appointment={selectedAppointment}
          onClose={handleFormClose}
        />
      )}

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Appointment"
        content={`Are you sure you want to delete the appointment for "${selectedAppointment?.patientName}"?`}
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

export default AppointmentManagement;
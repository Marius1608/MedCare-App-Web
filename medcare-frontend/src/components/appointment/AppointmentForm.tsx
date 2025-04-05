// src/components/appointment/AppointmentForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { parseISO, format, isValid } from 'date-fns';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { 
  Appointment, 
  AppointmentStatus 
} from '../../types/appointment.types';
import { createAppointment, updateAppointment } from '../../api/appointment.api';
import { getAllDoctors, checkDoctorAvailability } from '../../api/doctor.api';
import { getAllMedicalServices } from '../../api/service.api';

interface AppointmentFormProps {
  open: boolean;
  appointment: Appointment | null;
  onClose: (refresh?: boolean) => void;
}

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  workHours: string;
}

interface MedicalService {
  id: number;
  name: string;
  price: number;
  duration: number;
}

const validationSchema = yup.object({
  patientName: yup
    .string()
    .required('Patient name is required')
    .min(3, 'Patient name must be at least 3 characters')
    .max(100, 'Patient name must be at most 100 characters'),
  doctorId: yup
    .mixed()
    .required('Doctor is required'),
  dateTime: yup
    .date()
    .required('Date and time are required')
    .min(new Date(), 'Date and time must be in the future'),
  serviceId: yup
    .mixed()
    .required('Service is required'),
  status: yup
    .string()
    .required('Status is required'),
});

const AppointmentForm: React.FC<AppointmentFormProps> = ({ open, appointment, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<MedicalService[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const isNewAppointment = !appointment;

  const getInitialDateTime = () => {
    if (appointment?.dateTime) {
      const parsed = parseISO(appointment.dateTime);
      return isValid(parsed) ? parsed : new Date();
    }
    return new Date();
  };

  const initialValues = {
    patientName: appointment?.patientName || '',
    doctorId: appointment?.doctor?.id || '',
    dateTime: getInitialDateTime(),
    serviceId: appointment?.service?.id || '',
    status: appointment?.status || AppointmentStatus.NEW,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsResponse, servicesResponse] = await Promise.all([
          getAllDoctors(),
          getAllMedicalServices(),
        ]);
        
        setDoctors(doctorsResponse.data);
        setServices(servicesResponse.data);
      } catch (error) {
        console.error('Error fetching form data:', error);
        setError('Failed to load doctors and services. Please try again.');
      }
    };
    
    fetchData();
  }, []);

  // Helper function to convert string or mixed values to number
  const toNumber = (value: string | number | undefined): number | undefined => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && value !== '') return parseInt(value, 10);
    return undefined;
  };

  const checkAvailability = async (doctorId: number, dateTime: Date, duration: number) => {
    if (!doctorId || !isValid(dateTime) || !duration) return;
    
    setAvailabilityLoading(true);
    setAvailabilityError(null);
    
    try {
      const formattedDateTime = format(dateTime, "yyyy-MM-dd'T'HH:mm:ss");
      const response = await checkDoctorAvailability(doctorId, formattedDateTime, duration);
      
      if (!response.data) {
        setAvailabilityError('The doctor is not available at this time. Please select another time or doctor.');
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailabilityError('Failed to check doctor availability. Please try again.');
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      
      // Convert string IDs to numbers
      const doctorId = toNumber(values.doctorId);
      const serviceId = toNumber(values.serviceId);
      
      if (!doctorId || !serviceId) {
        setError('Invalid doctor or service selected');
        setLoading(false);
        return;
      }
      
      const selectedService = services.find(s => s.id === doctorId);
      const selectedDoctor = doctors.find(d => d.id === serviceId);
      
      if (!selectedService || !selectedDoctor) {
        setError('Invalid doctor or service selected');
        setLoading(false);
        return;
      }

      try {
        const formattedDateTime = format(values.dateTime, "yyyy-MM-dd'T'HH:mm:ss");
        const availabilityResponse = await checkDoctorAvailability(
          doctorId, 
          formattedDateTime, 
          selectedService.duration
        );
        
        if (!availabilityResponse.data && 
            (!appointment || 
             appointment.doctor.id !== doctorId || 
             appointment.dateTime !== formattedDateTime)) {
          setError('The doctor is not available at this time. Please select another time or doctor.');
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error checking availability:', error);
      }
      
      try {
        // Find the complete doctor and service objects
        const doctor = doctors.find(d => d.id === doctorId);
        const service = services.find(s => s.id === serviceId);
        
        if (!doctor || !service) {
          setError('Selected doctor or service not found');
          setLoading(false);
          return;
        }
        
        const appointmentData: Partial<Appointment> = {
          patientName: values.patientName,
          doctor: doctor,
          dateTime: format(values.dateTime, "yyyy-MM-dd'T'HH:mm:ss"),
          service: service,
          status: values.status,
        };

        if (isNewAppointment) {
          await createAppointment(appointmentData);
        } else if (appointment) {
          await updateAppointment(appointment.id!, appointmentData);
        }
        
        onClose(true);
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const doctorId = toNumber(formik.values.doctorId);
    const serviceId = toNumber(formik.values.serviceId);
    
    if (doctorId && formik.values.dateTime && serviceId) {
      const selectedService = services.find(s => s.id === serviceId);
      if (selectedService) {
        checkAvailability(doctorId, formik.values.dateTime, selectedService.duration);
      }
    }
  }, [formik.values.doctorId, formik.values.dateTime, formik.values.serviceId, services]);

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="md" fullWidth>
      <DialogTitle>{isNewAppointment ? 'Create Appointment' : 'Edit Appointment'}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {availabilityError && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {availabilityError}
            </Alert>
          )}
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                id="patientName"
                name="patientName"
                label="Patient Name"
                value={formik.values.patientName}
                onChange={formik.handleChange}
                error={formik.touched.patientName && Boolean(formik.errors.patientName)}
                helperText={formik.touched.patientName && formik.errors.patientName}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="doctor-label">Doctor</InputLabel>
                <Select
                  labelId="doctor-label"
                  id="doctorId"
                  name="doctorId"
                  value={formik.values.doctorId}
                  onChange={formik.handleChange}
                  label="Doctor"
                  error={formik.touched.doctorId && Boolean(formik.errors.doctorId)}
                >
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="service-label">Medical Service</InputLabel>
                <Select
                  labelId="service-label"
                  id="serviceId"
                  name="serviceId"
                  value={formik.values.serviceId}
                  onChange={formik.handleChange}
                  label="Medical Service"
                  error={formik.touched.serviceId && Boolean(formik.errors.serviceId)}
                >
                  {services.map((service) => (
                    <MenuItem key={service.id} value={service.id}>
                      {service.name} - {service.duration} min - ${service.price}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Date and Time"
                  value={formik.values.dateTime}
                  onChange={(date) => formik.setFieldValue('dateTime', date)}
                  slotProps={{
                    textField: {
                      margin: 'normal',
                      fullWidth: true,
                      error: formik.touched.dateTime && Boolean(formik.errors.dateTime),
                      helperText: formik.touched.dateTime && (formik.errors.dateTime as string),
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  label="Status"
                  error={formik.touched.status && Boolean(formik.errors.status)}
                >
                  <MenuItem value={AppointmentStatus.NEW}>New</MenuItem>
                  <MenuItem value={AppointmentStatus.IN_PROGRESS}>In Progress</MenuItem>
                  <MenuItem value={AppointmentStatus.COMPLETED}>Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {formik.values.doctorId && 
             doctors.find(d => d.id === toNumber(formik.values.doctorId)) && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Working Hours: {doctors.find(d => d.id === toNumber(formik.values.doctorId))?.workHours}
                </Typography>
              </Grid>
            )}
            
            {availabilityLoading && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Checking doctor availability...
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => onClose()} disabled={loading}>
            Cancel
          </Button>
          <Box sx={{ position: 'relative' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || Boolean(availabilityError)}
            >
              {isNewAppointment ? 'Create' : 'Save'}
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AppointmentForm;
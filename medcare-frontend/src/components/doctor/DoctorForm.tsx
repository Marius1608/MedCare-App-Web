// src/components/doctor/DoctorForm.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Doctor } from '../../types/doctor.types';
import { createDoctor, updateDoctor } from '../../api/doctor.api';

interface DoctorFormProps {
  open: boolean;
  doctor: Doctor | null;
  onClose: (refresh?: boolean) => void;
}

const validationSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be at most 100 characters'),
  specialization: yup
    .string()
    .required('Specialization is required')
    .min(3, 'Specialization must be at least 3 characters')
    .max(100, 'Specialization must be at most 100 characters'),
  workHours: yup
    .string()
    .required('Work hours are required')
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Work hours must be in format HH:MM-HH:MM'
    ),
});

const specializations = [
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'General Medicine',
  'Neurology',
  'Obstetrics & Gynecology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Urology',
];

const DoctorForm: React.FC<DoctorFormProps> = ({ open, doctor, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isNewDoctor = !doctor;
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  // Parse work hours into start and end time
  React.useEffect(() => {
    if (doctor?.workHours) {
      const [start, end] = doctor.workHours.split('-');
      const today = new Date();
      const [startHour, startMinute] = start.trim().split(':');
      const [endHour, endMinute] = end.trim().split(':');
      
      const startTimeObj = new Date(today);
      startTimeObj.setHours(parseInt(startHour, 10), parseInt(startMinute, 10), 0);
      
      const endTimeObj = new Date(today);
      endTimeObj.setHours(parseInt(endHour, 10), parseInt(endMinute, 10), 0);
      
      setStartTime(startTimeObj);
      setEndTime(endTimeObj);
    }
  }, [doctor]);

  const initialValues = {
    name: doctor?.name || '',
    specialization: doctor?.specialization || '',
    workHours: doctor?.workHours || '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      
      try {
        const doctorData = {
          ...values,
          workHours: startTime && endTime 
            ? `${format(startTime, 'HH:mm')}-${format(endTime, 'HH:mm')}` 
            : values.workHours,
        };

        if (isNewDoctor) {
          await createDoctor(doctorData);
        } else if (doctor) {
          await updateDoctor(doctor.id, doctorData);
        }
        
        onClose(true);
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  React.useEffect(() => {
    if (startTime && endTime) {
      const workHours = `${format(startTime, 'HH:mm')}-${format(endTime, 'HH:mm')}`;
      formik.setFieldValue('workHours', workHours);
    }
  }, [startTime, endTime]);

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="md" fullWidth>
      <DialogTitle>{isNewDoctor ? 'Add Doctor' : 'Edit Doctor'}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                id="name"
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="specialization-label">Specialization</InputLabel>
                <Select
                  labelId="specialization-label"
                  id="specialization"
                  name="specialization"
                  label="Specialization"
                  value={formik.values.specialization}
                  onChange={formik.handleChange}
                  error={formik.touched.specialization && Boolean(formik.errors.specialization)}
                >
                  {specializations.map((spec) => (
                    <MenuItem key={spec} value={spec}>
                      {spec}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TimePicker
                      label="Start Time"
                      value={startTime}
                      onChange={(newTime) => setStartTime(newTime)}
                      slotProps={{
                        textField: {
                          margin: 'normal',
                          fullWidth: true,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TimePicker
                      label="End Time"
                      value={endTime}
                      onChange={(newTime) => setEndTime(newTime)}
                      slotProps={{
                        textField: {
                          margin: 'normal',
                          fullWidth: true,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
              
              <TextField
                fullWidth
                margin="normal"
                id="workHours"
                name="workHours"
                label="Work Hours (HH:MM-HH:MM)"
                value={formik.values.workHours}
                onChange={formik.handleChange}
                error={formik.touched.workHours && Boolean(formik.errors.workHours)}
                helperText={formik.touched.workHours && formik.errors.workHours}
              />
            </Grid>
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
              disabled={loading}
            >
              {isNewDoctor ? 'Add' : 'Save'}
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

export default DoctorForm;
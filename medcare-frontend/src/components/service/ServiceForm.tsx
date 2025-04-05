// src/components/service/ServiceForm.tsx
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
  InputAdornment,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { MedicalService } from '../../types/service.types';
import { createMedicalService, updateMedicalService } from '../../api/service.api';

interface ServiceFormProps {
  open: boolean;
  service: MedicalService | null;
  onClose: (refresh?: boolean) => void;
}

const validationSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be at most 100 characters'),
  price: yup
    .number()
    .required('Price is required')
    .positive('Price must be positive')
    .max(99999, 'Price must be less than 100,000'),
  duration: yup
    .number()
    .required('Duration is required')
    .positive('Duration must be positive')
    .integer('Duration must be a whole number')
    .max(480, 'Duration must be at most 8 hours (480 minutes)'),
});

const ServiceForm: React.FC<ServiceFormProps> = ({ open, service, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isNewService = !service;

  const initialValues = {
    name: service?.name || '',
    price: service?.price || 0,
    duration: service?.duration || 30,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      
      try {
        const serviceData = {
          ...values,
          price: Number(values.price),
          duration: Number(values.duration),
        };

        if (isNewService) {
          await createMedicalService(serviceData);
        } else if (service) {
          await updateMedicalService(service.id, serviceData);
        }
        
        onClose(true);
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="sm" fullWidth>
      <DialogTitle>{isNewService ? 'Add Medical Service' : 'Edit Medical Service'}</DialogTitle>
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
                label="Service Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                id="price"
                name="price"
                label="Price"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                id="duration"
                name="duration"
                label="Duration"
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
                }}
                value={formik.values.duration}
                onChange={formik.handleChange}
                error={formik.touched.duration && Boolean(formik.errors.duration)}
                helperText={formik.touched.duration && formik.errors.duration}
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
              {isNewService ? 'Add' : 'Save'}
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

export default ServiceForm;
// src/components/user/UserForm.tsx
import React, { useState } from 'react';
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
} from '@mui/material';
import { User, UserRole } from '../../types/user.types';
import { createUser, updateUser } from '../../api/user.api';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface UserFormProps {
  open: boolean;
  user: User | null;
  onClose: (refresh?: boolean) => void;
}

const validationSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be at most 100 characters'),
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters'),
  password: yup
    .string()
    .when('isNewUser', {
      is: true,
      then: (schema) => schema
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
      otherwise: (schema) => schema
        .test(
          'emptyOrMinLength',
          'Password must be at least 6 characters',
          (value) => !value || value.length >= 6
        ),
    }),
  role: yup.string().required('Role is required'),
});

const UserForm: React.FC<UserFormProps> = ({ open, user, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isNewUser = !user;

  const initialValues = {
    name: user?.name || '',
    username: user?.username || '',
    password: '',
    role: user?.role || UserRole.RECEPTIONIST,
    isNewUser,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      
      try {
        const userData = {
          id: user?.id,
          name: values.name,
          username: values.username,
          role: values.role,
          ...(values.password || isNewUser ? { password: values.password } : {}),
        };

        if (isNewUser) {
          await createUser(userData);
        } else if (user) {
          await updateUser(user.id, userData);
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
      <DialogTitle>{isNewUser ? 'Add User' : 'Edit User'}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
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
          
          <TextField
            fullWidth
            margin="normal"
            id="username"
            name="username"
            label="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          
          <TextField
            fullWidth
            margin="normal"
            id="password"
            name="password"
            label={isNewUser ? "Password" : "Password (leave empty to keep current)"}
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              label="Role"
              error={formik.touched.role && Boolean(formik.errors.role)}
            >
              <MenuItem value={UserRole.ADMIN}>Administrator</MenuItem>
              <MenuItem value={UserRole.RECEPTIONIST}>Receptionist</MenuItem>
            </Select>
          </FormControl>
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
              {isNewUser ? 'Add' : 'Save'}
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

export default UserForm;
// src/pages/admin/UserManagement.tsx
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
import { getAllUsers, deleteUser } from '../../api/user.api';
import UserForm from '../../components/user/UserForm';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { User } from '../../types/user.types';
import StyledDataGrid from '../../components/common/StyledDataGrid';

const UserManagement: React.FC = () => {
  const theme = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setAlertMessage({ type: 'error', message: 'Failed to load users. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUser) {
      try {
        await deleteUser(selectedUser.id);
        setIsDeleteDialogOpen(false);
        fetchUsers();
        setAlertMessage({ type: 'success', message: 'User deleted successfully!' });
      } catch (error) {
        console.error('Error deleting user:', error);
        setAlertMessage({ type: 'error', message: 'Failed to delete user.' });
      }
    }
  };

  const handleFormClose = (refresh: boolean = false) => {
    setIsFormOpen(false);
    if (refresh) {
      fetchUsers();
    }
  };

  const handleAlertClose = () => {
    setAlertMessage(null);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'username', headerName: 'Username', width: 200 },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 150,
      renderCell: (params) => (
        <Box sx={{ 
          bgcolor: params.row.role === 'ADMIN' ? theme.palette.error.light + '20' : theme.palette.primary.light + '20',
          color: params.row.role === 'ADMIN' ? theme.palette.error.dark : theme.palette.primary.dark,
          py: 0.5,
          px: 1.5,
          borderRadius: 1,
          fontWeight: 500,
          fontSize: '0.8125rem'
        }}>
          {params.row.role}
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
              onClick={() => handleEditUser(params.row as User)}
              sx={{ mr: 1 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              size="small"
              onClick={() => handleDeleteClick(params.row as User)}
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
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add, edit, and manage user accounts in the system
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddUser}
          sx={{ borderRadius: 2, px: 3 }}
        >
          Add User
        </Button>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <StyledDataGrid
          rows={users}
          columns={columns}
          loading={loading}
        />
      </Paper>

      {isFormOpen && (
        <UserForm
          open={isFormOpen}
          user={selectedUser}
          onClose={handleFormClose}
        />
      )}

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete User"
        content={`Are you sure you want to delete the user "${selectedUser?.name}"?`}
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

export default UserManagement;
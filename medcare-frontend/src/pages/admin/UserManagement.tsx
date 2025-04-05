//src/pages/admin/UserManagement.tsx
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
import { getAllUsers, deleteUser } from '../../api/user.api';
import UserForm from '../../components/user/UserForm';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { User } from '../../types/user.types';

const UserManagement: React.FC = () => {
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
      valueGetter: (params) => params.row.role || '' 
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
            onClick={() => handleEditUser(params.row as User)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDeleteClick(params.row as User)}
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
          User Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddUser}
        >
          Add User
        </Button>
      </Paper>

      <Paper sx={{ p: 2, height: 'calc(100vh - 220px)' }}>
        <DataGrid
          rows={users}
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
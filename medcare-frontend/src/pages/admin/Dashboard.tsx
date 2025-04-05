// src/pages/admin/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  Paper,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
} from '@mui/material';
import {
  PeopleAlt as PeopleIcon,
  LocalHospital as DoctorIcon,
  MedicalServices as ServiceIcon,
  CalendarMonth as AppointmentIcon,
  Assessment as ReportIcon,
  Person as PersonIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../api/user.api';
import { getAllDoctors } from '../../api/doctor.api';
import { getAllMedicalServices } from '../../api/service.api';
import { getAllAppointments } from '../../api/appointment.api';
import { format, parseISO } from 'date-fns';
import { Appointment, AppointmentStatus } from '../../types/appointment.types';
import { User } from '../../types/user.types';
import { Doctor } from '../../types/doctor.types';
import { MedicalService } from '../../types/service.types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
    services: 0,
    appointments: 0,
    pendingAppointments: 0,
  });
  const [latestAppointments, setLatestAppointments] = useState<Appointment[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [usersRes, doctorsRes, servicesRes, appointmentsRes] = await Promise.all([
          getAllUsers(),
          getAllDoctors(),
          getAllMedicalServices(),
          getAllAppointments()
        ]);

        const users = usersRes.data as User[];
        const doctors = doctorsRes.data as Doctor[];
        const services = servicesRes.data as MedicalService[];
        const appointments = appointmentsRes.data as Appointment[];
        
        // Sort appointments by date (newest first)
        const sortedAppointments = [...appointments].sort(
          (a: Appointment, b: Appointment) => 
            new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
        );
        
        // Sort users by ID (newest first, assuming higher ID = newer)
        const sortedUsers = [...users].sort((a: User, b: User) => b.id - a.id);
        
        // Count pending appointments (NEW and IN_PROGRESS)
        const pendingAppointments = appointments.filter(
          (a: Appointment) => a.status === AppointmentStatus.NEW || a.status === AppointmentStatus.IN_PROGRESS
        ).length;

        setStats({
          users: users.length,
          doctors: doctors.length,
          services: services.length,
          appointments: appointments.length,
          pendingAppointments
        });
        
        setLatestAppointments(sortedAppointments.slice(0, 5)); // Latest 5 appointments
        setRecentUsers(sortedUsers.slice(0, 5)); // Latest 5 users
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Welcome to the MedCare System administration panel. Monitor clinic operations and manage system resources.
            </Typography>
          </Paper>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <PeopleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" component="div">
                {stats.users}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Users
              </Typography>
              <Button 
                variant="text" 
                size="small" 
                onClick={() => handleNavigate('/admin/users')}
                sx={{ mt: 1 }}
              >
                Manage
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <DoctorIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h4" component="div">
                {stats.doctors}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Doctors
              </Typography>
              <Button 
                variant="text" 
                size="small" 
                onClick={() => handleNavigate('/admin/doctors')}
                sx={{ mt: 1 }}
              >
                Manage
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <ServiceIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" component="div">
                {stats.services}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Services
              </Typography>
              <Button 
                variant="text" 
                size="small" 
                onClick={() => handleNavigate('/admin/services')}
                sx={{ mt: 1 }}
              >
                Manage
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <AppointmentIcon sx={{ fontSize: 48, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" component="div">
                {stats.appointments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Appointments
              </Typography>
              <Button 
                variant="text" 
                size="small" 
                onClick={() => handleNavigate('/receptionist/appointments')}
                sx={{ mt: 1 }}
              >
                View
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <ReportIcon sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" component="div">
                {stats.pendingAppointments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Appointments
              </Typography>
              <Button 
                variant="text" 
                size="small" 
                onClick={() => handleNavigate('/admin/reports')}
                sx={{ mt: 1 }}
              >
                Reports
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3} md={2}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<AddIcon />}
                  onClick={() => handleNavigate('/admin/users')}
                  sx={{ mb: 1 }}
                >
                  Add User
                </Button>
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<AddIcon />}
                  onClick={() => handleNavigate('/admin/doctors')}
                  sx={{ mb: 1 }}
                >
                  Add Doctor
                </Button>
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<AddIcon />}
                  onClick={() => handleNavigate('/admin/services')}
                  sx={{ mb: 1 }}
                >
                  Add Service
                </Button>
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<ReportIcon />}
                  onClick={() => handleNavigate('/admin/reports')}
                  sx={{ mb: 1 }}
                >
                  Generate Report
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Users & Latest Appointments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Users
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {recentUsers.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No users added yet.
                </Typography>
              </Box>
            ) : (
              <List>
                {recentUsers.map((user) => (
                  <ListItem key={user.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.name}
                      secondary={
                        <>
                          {user.username} - {user.role}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Latest Appointments
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {latestAppointments.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No appointments scheduled yet.
                </Typography>
              </Box>
            ) : (
              <List>
                {latestAppointments.map((appointment) => (
                  <ListItem key={appointment.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'info.main' }}>
                        {appointment.patientName.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={appointment.patientName}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {appointment.doctor.name} - {appointment.service.name}
                          </Typography>
                          <br />
                          {format(parseISO(appointment.dateTime), 'MMM dd, yyyy HH:mm')} - {getStatusChip(appointment.status)}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
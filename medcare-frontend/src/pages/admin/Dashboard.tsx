//src/pages/admin/Dashboard.tsx to use the new StatsCard component
import React, { useState, useEffect } from 'react';
import { 
  Box, 
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
  useTheme,
} from '@mui/material';
import {
  PeopleAlt as PeopleIcon,
  LocalHospital as DoctorIcon,
  MedicalServices as ServiceIcon,
  CalendarMonth as AppointmentIcon,
  Assessment as ReportIcon,
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
import StatsCard from '../../components/common/StatsCard';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
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
        
        const sortedAppointments = [...appointments].sort(
          (a: Appointment, b: Appointment) => 
            new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
        );
        
        const sortedUsers = [...users].sort((a: User, b: User) => b.id - a.id);
        
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
        
        setLatestAppointments(sortedAppointments.slice(0, 5)); 
        setRecentUsers(sortedUsers.slice(0, 5)); 
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
          <Paper sx={{ p: 4, mb: 3, borderRadius: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Admin Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Welcome to the MedCare System administration panel. Monitor clinic operations and manage system resources.
            </Typography>
          </Paper>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={2.4}>
          <StatsCard 
            title="Users" 
            value={stats.users} 
            icon={<PeopleIcon sx={{ fontSize: 32 }} />} 
            color={theme.palette.primary.main}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <StatsCard 
            title="Doctors" 
            value={stats.doctors} 
            icon={<DoctorIcon sx={{ fontSize: 32 }} />} 
            color={theme.palette.secondary.main}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <StatsCard 
            title="Services" 
            value={stats.services} 
            icon={<ServiceIcon sx={{ fontSize: 32 }} />} 
            color={theme.palette.success.main}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <StatsCard 
            title="Appointments" 
            value={stats.appointments} 
            icon={<AppointmentIcon sx={{ fontSize: 32 }} />} 
            color={theme.palette.info.main}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <StatsCard 
            title="Pending" 
            value={stats.pendingAppointments} 
            icon={<ReportIcon sx={{ fontSize: 32 }} />} 
            color={theme.palette.warning.main}
          />
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Actions
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3} md={2}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<AddIcon />}
                  onClick={() => handleNavigate('/admin/users')}
                  sx={{ py: 1.5, borderRadius: 2 }}
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
                  sx={{ py: 1.5, borderRadius: 2 }}
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
                  sx={{ py: 1.5, borderRadius: 2 }}
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
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Generate Report
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
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
                  <ListItem key={user.id} divider sx={{ px: 2, py: 1.5 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                        {user.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="subtitle1" fontWeight={500}>{user.name}</Typography>}
                      secondary={
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {user.username}
                          </Typography>
                          <Chip 
                            label={user.role} 
                            size="small" 
                            color={user.role === 'ADMIN' ? 'error' : 'primary'}
                            sx={{ ml: 1, height: 24 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
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
                  <ListItem key={appointment.id} divider sx={{ px: 2, py: 1.5 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.info.light }}>
                        {appointment.patientName.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="subtitle1" fontWeight={500}>{appointment.patientName}</Typography>}
                      secondary={
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Typography component="span" variant="body2" color="text.secondary">
                              {appointment.doctor.name} • {appointment.service.name}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                              {format(parseISO(appointment.dateTime), 'MMM dd, yyyy HH:mm')}
                            </Typography>
                            {getStatusChip(appointment.status)}
                          </Box>
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
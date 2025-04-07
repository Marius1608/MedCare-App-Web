// src/pages/receptionist/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  Add as AddIcon,
  CheckCircleOutline as CompletedIcon,
  HourglassEmpty as PendingIcon,
  Today as TodayIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getAllDoctors } from '../../api/doctor.api';
import { getAllAppointments } from '../../api/appointment.api';
import { formatDateTime } from '../../utils/date.utils';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Appointment, AppointmentStatus } from '../../types/appointment.types';
import { Doctor } from '../../types/doctor.types';
import { format, isToday, parseISO, startOfDay, endOfDay } from 'date-fns';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const ReceptionistDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    inProgress: 0,
    completed: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [appointmentsRes, doctorsRes] = await Promise.all([
          getAllAppointments(),
          getAllDoctors()
        ]);

        const appointments = appointmentsRes.data;
        
        const today = appointments.filter((appointment: Appointment) => 
          isToday(parseISO(appointment.dateTime))
        ).sort((a: Appointment, b: Appointment) => 
          parseISO(a.dateTime).getTime() - parseISO(b.dateTime).getTime()
        );
        
        const upcoming = appointments.filter((appointment: Appointment) => 
          parseISO(appointment.dateTime) > endOfDay(new Date())
        ).sort((a: Appointment, b: Appointment) => 
          parseISO(a.dateTime).getTime() - parseISO(b.dateTime).getTime()
        ).slice(0, 5); 

        const newAppointments = appointments.filter((a: Appointment) => a.status === AppointmentStatus.NEW).length;
        const inProgressAppointments = appointments.filter((a: Appointment) => a.status === AppointmentStatus.IN_PROGRESS).length;
        const completedAppointments = appointments.filter((a: Appointment) => a.status === AppointmentStatus.COMPLETED).length;

        setTodayAppointments(today);
        setUpcomingAppointments(upcoming);
        setDoctors(doctorsRes.data);
        setStats({
          total: appointments.length,
          new: newAppointments,
          inProgress: inProgressAppointments,
          completed: completedAppointments
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleNewAppointment = () => {
    navigate('/receptionist/appointments');
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Receptionist Dashboard
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleNewAppointment}
              >
                New Appointment
              </Button>
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              Welcome to the MedCare System receptionist panel. Manage appointments and patient visits.
            </Typography>
          </Paper>
        </Grid>

        {/* Statistics Cards Row */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CalendarIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" component="div">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Appointments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PendingIcon sx={{ fontSize: 48, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" component="div">
                {stats.new}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                New Appointments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <HourglassEmptyIcon sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" component="div">
                {stats.inProgress}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CompletedIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" component="div">
                {stats.completed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Appointments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TodayIcon sx={{ mr: 1 }} /> Today's Appointments
            </Typography>
            <Divider />
            
            {todayAppointments.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No appointments scheduled for today.
                </Typography>
              </Box>
            ) : (
              <List>
                {todayAppointments.map((appointment) => (
                  <ListItem key={appointment.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
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
                          {format(parseISO(appointment.dateTime), 'HH:mm')} - {getStatusChip(appointment.status)}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ScheduleIcon sx={{ mr: 1 }} /> Upcoming Appointments
            </Typography>
            <Divider />
            
            {upcomingAppointments.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No upcoming appointments scheduled.
                </Typography>
              </Box>
            ) : (
              <List>
                {upcomingAppointments.map((appointment) => (
                  <ListItem key={appointment.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
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
                          {format(parseISO(appointment.dateTime), 'MMM dd, yyyy HH:mm')}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Available Doctors */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Available Doctors
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              {doctors.map((doctor) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={doctor.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {doctor.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {doctor.specialization}
                      </Typography>
                      <Typography variant="body2">
                        Working Hours: {doctor.workHours}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReceptionistDashboard;
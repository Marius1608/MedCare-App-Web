// src/components/report/ReportView.tsx
import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Divider, 
  Grid, 
  Paper, 
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, parseISO } from 'date-fns';
import { ReportDTO } from '../../types/report.types';
import { AppointmentStatus } from '../../types/appointment.types';

interface ReportViewProps {
  report: ReportDTO | null;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const ReportView: React.FC<ReportViewProps> = ({ report }) => {
  if (!report) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="subtitle1" color="text.secondary">
          No report data to display. Use the filters above to generate a report.
        </Typography>
      </Box>
    );
  }

  // Format dates for display
  const startDateFormatted = format(new Date(report.startDate), 'MMM dd, yyyy');
  const endDateFormatted = format(new Date(report.endDate), 'MMM dd, yyyy');

  // Prepare doctor statistics chart data
  const doctorChartData = Object.entries(report.doctorStatistics).map(([key, value]) => {
    // Extract doctor name from the key - assuming key is in format "Doctor Name (Specialization)"
    const match = key.match(/(.*) \((.*)\)/);
    const name = match ? match[1] : key;
    return {
      name,
      appointments: value
    };
  });

  // Prepare service statistics chart data
  const serviceChartData = Object.entries(report.serviceStatistics).map(([key, value]) => {
    // Extract service name from the key - assuming key is in format "Service Name - $Price"
    const name = key.split(' - ')[0];
    return {
      name,
      appointments: value
    };
  });

  // Count appointment statuses
  const statusCounts = report.appointments.reduce((acc, appointment) => {
    const status = appointment.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<AppointmentStatus, number>);

  const statusChartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count
  }));

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

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Report Summary
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Period: {startDateFormatted} - {endDateFormatted}
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {report.appointments.length}
                </Typography>
                <Typography variant="body2">Total Appointments</Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {Object.keys(report.doctorStatistics).length}
                </Typography>
                <Typography variant="body2">Doctors</Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {Object.keys(report.serviceStatistics).length}
                </Typography>
                <Typography variant="body2">Medical Services</Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Doctor Performance
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={doctorChartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="appointments" fill="#8884d8" name="Appointments" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Services Breakdown
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={serviceChartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="appointments" fill="#82ca9d" name="Appointments" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Appointment Status Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Appointment Details
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Patient</TableCell>
                      <TableCell>Doctor</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {report.appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{appointment.patientName}</TableCell>
                        <TableCell>{appointment.doctor.name}</TableCell>
                        <TableCell>{appointment.service.name}</TableCell>
                        <TableCell>
                          {format(parseISO(appointment.dateTime), 'MMM dd, yyyy HH:mm')}
                        </TableCell>
                        <TableCell>{getStatusChip(appointment.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportView;
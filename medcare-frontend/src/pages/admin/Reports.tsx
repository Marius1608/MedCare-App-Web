// src/pages/admin/Reports.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import { 
  FileDownload as DownloadIcon,
  CalendarMonth as CalendarIcon,
  LocalHospital as DoctorIcon,
  MedicalServices as ServiceIcon,
  QueryStats as StatsIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { 
  generateReport, 
  exportReportToCsv, 
  exportReportToXml 
} from '../../api/report.api';
import { toISOString } from '../../utils/date.utils';
import { ReportDTO } from '../../types/report.types';

const Reports: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1) // First day of current month
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [reportData, setReportData] = useState<ReportDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    if (startDate > endDate) {
      setError('Start date must be before end date');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const formattedStartDate = toISOString(startDate);
      const formattedEndDate = toISOString(endDate);
      
      const response = await generateReport(formattedStartDate, formattedEndDate);
      setReportData(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    setExportLoading(true);
    setError(null);
    setExportSuccess(null);
    
    try {
      const formattedStartDate = toISOString(startDate);
      const formattedEndDate = toISOString(endDate);
      
      const response = await exportReportToCsv(formattedStartDate, formattedEndDate);
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setExportSuccess('Report exported successfully as CSV!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      setError('Failed to export CSV. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportXml = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    setExportLoading(true);
    setError(null);
    setExportSuccess(null);
    
    try {
      const formattedStartDate = toISOString(startDate);
      const formattedEndDate = toISOString(endDate);
      
      const response = await exportReportToXml(formattedStartDate, formattedEndDate);
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${format(new Date(), 'yyyyMMdd_HHmmss')}.xml`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setExportSuccess('Report exported successfully as XML!');
    } catch (error) {
      console.error('Error exporting XML:', error);
      setError('Failed to export XML. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Reports & Analytics
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Generate reports and analyze clinic performance over specified time periods.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Date Range Selection
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {exportSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {exportSuccess}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Start Date & Time"
                value={startDate}
                onChange={setStartDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined'
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={5}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="End Date & Time"
                value={endDate}
                onChange={setEndDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined'
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleGenerateReport}
              disabled={loading || !startDate || !endDate}
              startIcon={loading ? <CircularProgress size={20} /> : <StatsIcon />}
              sx={{ height: '56px' }}
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={exportLoading ? <CircularProgress size={20} /> : <DownloadIcon />}
            onClick={handleExportCsv}
            disabled={exportLoading || !startDate || !endDate}
          >
            Export as CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={exportLoading ? <CircularProgress size={20} /> : <DownloadIcon />}
            onClick={handleExportXml}
            disabled={exportLoading || !startDate || !endDate}
          >
            Export as XML
          </Button>
        </Box>
      </Paper>

      {reportData && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="report tabs">
              <Tab label="Summary" icon={<StatsIcon />} iconPosition="start" />
              <Tab label="Doctors" icon={<DoctorIcon />} iconPosition="start" />
              <Tab label="Services" icon={<ServiceIcon />} iconPosition="start" />
              <Tab label="Appointments" icon={<CalendarIcon />} iconPosition="start" />
            </Tabs>
          </Box>

          {/* Summary Tab */}
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Report Summary
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Period: {startDate && format(startDate, 'yyyy-MM-dd HH:mm')} to {endDate && format(endDate, 'yyyy-MM-dd HH:mm')}
              </Typography>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <CalendarIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                      <Typography variant="h4">
                        {reportData.appointments?.length || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Appointments
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <DoctorIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                      <Typography variant="h4">
                        {Object.keys(reportData.doctorStatistics || {}).length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Doctors
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <ServiceIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                      <Typography variant="h4">
                        {Object.keys(reportData.serviceStatistics || {}).length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Services Provided
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <StatsIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                      <Typography variant="h4">
                        {reportData.appointments && reportData.appointments.reduce((sum, appointment) => {
                          return sum + (appointment.service?.price || 0);
                        }, 0).toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Revenue ($)
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Doctors Tab */}
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Doctor Statistics
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Most requested doctors during the selected period
              </Typography>

              <List>
                {Object.entries(reportData.doctorStatistics || {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([doctorKey, count], index) => {
                    // Find the doctor object from the appointments
                    const doctorAppointment = reportData.appointments.find(
                      a => a.doctor && a.doctor.id.toString() === doctorKey
                    );
                    const doctor = doctorAppointment?.doctor;

                    return (
                      <ListItem key={index} divider>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {doctor?.name?.charAt(0) || 'D'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${doctor?.name || 'Unknown'} (${doctor?.specialization || 'Unknown'})`}
                          secondary={`${count} appointments`}
                        />
                        <Typography variant="body2">
                          {((count / reportData.appointments.length) * 100).toFixed(1)}% of total
                        </Typography>
                      </ListItem>
                    );
                  })}
              </List>
            </Box>
          )}

          {/* Services Tab */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Service Statistics
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Most requested services during the selected period
              </Typography>

              <List>
                {Object.entries(reportData.serviceStatistics || {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([serviceKey, count], index) => {
                    // Find the service object from the appointments
                    const serviceAppointment = reportData.appointments.find(
                      a => a.service && a.service.id.toString() === serviceKey
                    );
                    const service = serviceAppointment?.service;

                    return (
                      <ListItem key={index} divider>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'success.main' }}>
                            <ServiceIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={service?.name || 'Unknown'}
                          secondary={`Duration: ${service?.duration || 0} min | Price: $${service?.price || 0}`}
                        />
                        <Typography variant="body2">
                          {count} appointments ({((count / reportData.appointments.length) * 100).toFixed(1)}% of total)
                        </Typography>
                      </ListItem>
                    );
                  })}
              </List>
            </Box>
          )}

          {/* Appointments Tab */}
          {tabValue === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Appointment List
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                All appointments during the selected period
              </Typography>

              <List>
                {reportData.appointments
                  .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
                  .map((appointment, index) => (
                    <ListItem key={index} divider>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'info.main' }}>
                          {appointment.patientName.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={appointment.patientName}
                        secondary={`Dr. ${appointment.doctor.name} - ${appointment.service.name}`}
                      />
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Typography variant="body2">
                          {format(new Date(appointment.dateTime), 'yyyy-MM-dd HH:mm')}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          Status: {appointment.status}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
              </List>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default Reports;
// src/components/report/ReportFilter.tsx
import React from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Typography 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { endOfDay, startOfDay } from 'date-fns';

interface ReportFilterProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onGenerateReport: () => void;
  onExportCsv: () => void;
  onExportXml: () => void;
  loading: boolean;
}

const ReportFilter: React.FC<ReportFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onGenerateReport,
  onExportCsv,
  onExportXml,
  loading
}) => {
  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      // Set time to beginning of day
      onStartDateChange(startOfDay(date));
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      // Set time to end of day
      onEndDateChange(endOfDay(date));
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Report Filters
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={handleStartDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'normal',
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={handleEndDateChange}
                minDate={startDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'normal',
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1, mt: { xs: 2, md: 3 } }}>
              <Button
                variant="contained"
                onClick={onGenerateReport}
                disabled={loading}
              >
                Generate Report
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onExportCsv}
            disabled={loading}
          >
            Export CSV
          </Button>
          
          <Button
            variant="outlined"
            onClick={onExportXml}
            disabled={loading}
          >
            Export XML
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReportFilter;
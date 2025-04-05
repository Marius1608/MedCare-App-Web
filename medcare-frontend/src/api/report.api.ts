// src/api/report.api.ts
import api from './api';

export const generateReport = (startDate: string, endDate: string) => {
  return api.get(`/reports?startDate=${startDate}&endDate=${endDate}`);
};

export const exportReportToCsv = (startDate: string, endDate: string) => {
  return api.get(`/reports/export/csv?startDate=${startDate}&endDate=${endDate}`, {
    responseType: 'blob'
  });
};

export const exportReportToXml = (startDate: string, endDate: string) => {
  return api.get(`/reports/export/xml?startDate=${startDate}&endDate=${endDate}`, {
    responseType: 'blob'
  });
};
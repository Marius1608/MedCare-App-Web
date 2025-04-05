// src/api/appointment.api.ts
import api from './api';
import { Appointment } from '../types/appointment.types';

export const getAllAppointments = () => {
  return api.get('/appointments');
};

export const getAppointmentById = (id: number) => {
  return api.get(`/appointments/${id}`);
};

export const createAppointment = (appointmentData: Partial<Appointment>) => {
  return api.post('/appointments', appointmentData);
};

export const updateAppointment = (id: number, appointmentData: Partial<Appointment>) => {
  return api.put(`/appointments/${id}`, appointmentData);
};

export const updateAppointmentStatus = (id: number, status: string) => {
  return api.patch(`/appointments/${id}/status`, { status });
};

export const deleteAppointment = (id: number) => {
  return api.delete(`/appointments/${id}`);
};

export const getAppointmentsByDateRange = (start: string, end: string) => {
  return api.get(`/appointments/date-range?start=${start}&end=${end}`);
};
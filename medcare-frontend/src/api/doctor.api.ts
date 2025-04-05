// src/api/doctor.api.ts
import api from './api';
import { Doctor } from '../types/doctor.types';

export const getAllDoctors = () => {
  return api.get('/doctors');
};

export const getDoctorById = (id: number) => {
  return api.get(`/doctors/${id}`);
};

export const createDoctor = (doctorData: Partial<Doctor>) => {
  return api.post('/doctors', doctorData);
};

export const updateDoctor = (id: number, doctorData: Partial<Doctor>) => {
  return api.put(`/doctors/${id}`, doctorData);
};

export const deleteDoctor = (id: number) => {
  return api.delete(`/doctors/${id}`);
};

export const getDoctorsBySpecialization = (specialization: string) => {
  return api.get(`/doctors/specialization/${specialization}`);
};

export const checkDoctorAvailability = (
  doctorId: number, 
  dateTime: string, 
  duration: number
) => {
  return api.get(`/doctors/${doctorId}/availability?dateTime=${dateTime}&duration=${duration}`);
};
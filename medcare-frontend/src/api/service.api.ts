// src/api/service.api.ts
import api from './api';
import { MedicalService } from '../types/service.types';

export const getAllMedicalServices = () => {
  return api.get('/services');
};

export const getMedicalServiceById = (id: number) => {
  return api.get(`/services/${id}`);
};

export const createMedicalService = (serviceData: Partial<MedicalService>) => {
  return api.post('/services', serviceData);
};

export const updateMedicalService = (id: number, serviceData: Partial<MedicalService>) => {
  return api.put(`/services/${id}`, serviceData);
};

export const deleteMedicalService = (id: number) => {
  return api.delete(`/services/${id}`);
};
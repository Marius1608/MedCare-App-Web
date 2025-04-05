// src/types/report.types.ts
import { Appointment } from './appointment.types';
import { Doctor } from './doctor.types';
import { MedicalService } from './service.types';

export interface ReportDTO {
  appointments: Appointment[];
  doctorStatistics: Record<string, number>;
  serviceStatistics: Record<string, number>;
  startDate: string;
  endDate: string;
}

export interface DoctorStatistics {
  doctor: Doctor;
  count: number;
}

export interface ServiceStatistics {
  service: MedicalService;
  count: number;
}
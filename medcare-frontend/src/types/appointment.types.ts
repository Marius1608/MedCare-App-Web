export enum AppointmentStatus {
    NEW = 'NEW',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
  }
  
  export interface Appointment {
    id?: number;
    patientName: string;
    doctor: {
      id: number;
      name: string;
      specialization: string;
      workHours: string;
    };
    dateTime: string;
    service: {
      id: number;
      name: string;
      price: number;
      duration: number;
    };
    status: AppointmentStatus;
  }
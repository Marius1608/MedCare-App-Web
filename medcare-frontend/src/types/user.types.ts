// src/types/user.types.ts
export enum UserRole {
    ADMIN = 'ADMIN',
    RECEPTIONIST = 'RECEPTIONIST'
  }
  
  export interface User {
    id: number;
    name: string;
    username: string;
    password?: string;
    role: UserRole;
  }
// src/app/Interfaces/application.ts

export interface Application {
  id?: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  status: 'pending' | 'approved' | 'rejected';
  assignedStaffId?: string | null;
  createdAt: Date;
}
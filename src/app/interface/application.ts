export interface Application {
  id?: string;
  studentId: string;
  fullName: string;
  email: string; 
  standard: string;
  board: string;
  stream: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: Date;
}
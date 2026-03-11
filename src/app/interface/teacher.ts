export interface Teacher {
  id?: string;  // Firestore document id

  teacherId: string;
  teacherName: string;
  email: string;
  mobile: string;
  gender: string;
  subjects: string;
  experience: number;

  status: 'pending' | 'approved' | 'rejected';
  role: 'teacher';

  password?: string;   // Only after admin approval
  createdAt: Date;
}
export interface Teacher {
  teacherId: string;
  password: string;
  teacherName: string;
  email?: string;
  role: string;
  createdAt: Date;
}
export interface TeacherStudent {

  id?: string;

  studentId: string;

  studentName: string;

  email: string;

  standard: string;

  subjects: string[];

  teacherId: string;

  status: 'approved' | 'rejected';

}
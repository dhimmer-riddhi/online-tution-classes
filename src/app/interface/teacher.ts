export interface Teacher {

id?: string;

teacherId: string;
teacherName: string;
email: string;
mobile: string;
gender: string;

subjects: string[];     // multiple subjects
standards: string[];    // multiple standards

experience: number;

status: 'pending' | 'approved' | 'rejected';
role: 'teacher';

password?: string;

createdAt: Date;

}
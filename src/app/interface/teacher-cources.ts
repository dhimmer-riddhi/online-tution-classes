export interface TeacherCourse {
  standard: string;
  id?: string;
  courseId: string;
  courseName: string;   // 9th Standard, 10th Standard etc
  category?: string;    // Commerce, Science etc (11/12)
  subjects: string[];   // Subject list
  imageUrl?: string;    // optional image
  createdAt?: any;
}
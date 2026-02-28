import { Routes } from '@angular/router';
import { TeacherPortal } from './teacher-portal/teacher-portal';
import { TeacherRegistration } from './teacher-registration/teacher-registration';
import { TeacherLogin } from './teacher-login/teacher-login';
import { TeacherHeader } from './teacher-header/teacher-header';
import { TeacherDashboard } from './teacher-dashboard/teacher-dashboard';
import { TeacherStudents } from './teacher-students/teacher-students';
import { TeacherAttendance } from './teacher-attendance/teacher-attendance';
import { TeacherCourses } from './teacher-courses/teacher-courses';
import { TeacherAssignments } from './teacher-assignments/teacher-assignments';
import { TeacherReports } from './teacher-reports/teacher-reports';

export const TEACHER_ROUTES: Routes = [

  // 👉 default teacher page
  { path: '', component: TeacherPortal },

  { path: 'teacher-portal', component: TeacherPortal },
  { path: 'teacher-registration', component: TeacherRegistration },
  { path: 'teacher-login', component: TeacherLogin },

  { path: 'teacher-header', component: TeacherHeader },
  { path: 'teacher-dashboard', component: TeacherDashboard },
  { path: 'teacher-students', component: TeacherStudents },
  { path: 'teacher-attendance', component: TeacherAttendance },
  { path: 'teacher-courses', component: TeacherCourses },
  { path: 'teacher-assignments', component: TeacherAssignments },
  { path: 'teacher-reports', component: TeacherReports }
];
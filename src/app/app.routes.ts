import { Routes } from '@angular/router';
import { StudentHeader } from './student/student-header/student-header';
import { About } from './student/about/about';
import { StudHome } from './student/stud-home/stud-home';
import { AdminLogin } from './admin/admin-login/admin-login';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { AdminSidebar } from './admin/admin-sidebar/admin-sidebar';
import { StudRegistration } from './student/stud-registration/stud-registration';
import { StudSignIn } from './student/stud-sign-in/stud-sign-in';
import { TeacherPortal } from './teacher/teacher-portal/teacher-portal';
import { TeacherLogin } from './teacher/teacher-login/teacher-login';
import { TeacherRegistration } from './teacher/teacher-registration/teacher-registration';
import { TeacherCourses } from './teacher/teacher-courses/teacher-courses';
import { TeacherHeader } from './teacher/teacher-header/teacher-header';
import { TeacherDashboard } from './teacher/teacher-dashboard/teacher-dashboard';
import { TeacherStudents } from './teacher/teacher-students/teacher-students';
import { TeacherAttendance } from './teacher/teacher-attendance/teacher-attendance';

import { TeacherReports } from './teacher/teacher-reports/teacher-reports';
import { TeacherClassContent } from './teacher/teacher-class-content/teacher-class-content';
import { TeacherAssignment } from './teacher/teacher-assignment/teacher-assignment';
import { TeacherQuiz } from './teacher/teacher-quiz/teacher-quiz';


export const routes: Routes = [

  // Default page
  { path: '', redirectTo: 'student/stud-home', pathMatch: 'full' },

  // ================= STUDENT =================
  { path: 'student/student-header', component: StudentHeader },
  { path: 'student/about', component: About },
  { path: 'student/stud-home', component: StudHome },
    

  // ================= ADMIN =================
  { path: 'admin/admin-login', component: AdminLogin },
  { path: 'admin/admin-dashboard', component: AdminDashboard },
  { path: 'admin/admin-sidebar', component: AdminSidebar },

  //Teacher routes
  // { path: '', component: TeacherPortal },
  
  //   { path: 'teacher/teacher-portal', component: TeacherPortal },
  //   { path: 'teacher/teacher-registration', component: TeacherRegistration },
  //   { path: 'teacher/teacher-login', component: TeacherLogin },
  
  //   { path: 'teacher/teacher-header', component: TeacherHeader },
  //   { path: 'teacher/teacher-dashboard', component: TeacherDashboard },
  //   { path: 'teacher/teacher-students', component: TeacherStudents },
  //   { path: 'teacher/teacher-attendance', component: TeacherAttendance },
  //   { path: 'teacher/teacher-courses', component: TeacherCourses },
  //   { path: 'teacher/teacher-assignments', component: TeacherAssignments },
  //   { path: 'teacher/teacher-reports', component: TeacherReports },
  {
    path: 'teacher',
    children: [

      // Without Sidebar
      { path: 'teacher-portal', component: TeacherPortal },
      { path: 'teacher-login', component: TeacherLogin },
      { path: 'teacher-registration', component: TeacherRegistration },

      // WITH SIDEBAR (Main Dashboard Layout)
      {
        path: '',
        component: TeacherHeader,
        children: [
          { path: 'dashboard', component: TeacherDashboard },
          { path: 'students', component: TeacherStudents },
          { path: 'attendance', component: TeacherAttendance },
          { path: 'class-content', component: TeacherClassContent },
          { path: 'courses', component: TeacherCourses },
          { path: 'assignment', component: TeacherAssignment },
          { path: 'quiz', component: TeacherQuiz },
          { path: 'reports', component: TeacherReports },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
      }
    ]
  },
  // // Fallback
 // { path: '**', redirectTo: 'student/stud-home' },

  {
    path: 'student/student-header',
    component: StudentHeader
  },
  {
    path: 'student/stud-registration',
    component: StudRegistration
  },
  {
    path: 'student/stud-sign-in',
    component: StudSignIn
  },
  {
    path: 'student/stud-home',
    component: StudHome
  },
  {
    path: 'student/about',
    component: About
  },
  {
        path:'student/student-header',
        component: StudentHeader
  },
    {
        path:'student/stud-registration',
        component: StudRegistration
    },
    {
        path:'student/stud-sign-in',
        component: StudSignIn
    },
    {
        path:'student/stud-home',
        component: StudHome
    },
    {
        path:'student/about',
        component: About
    },
    {
         path: '',
         redirectTo: 'student/stud-home',
         pathMatch: 'full'
    },

    
];

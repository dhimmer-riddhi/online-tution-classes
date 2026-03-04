import { Routes } from '@angular/router';
import { StudentHeader } from './student/student-header/student-header';
import { About } from './student/about/about';
import { StudHome } from './student/stud-home/stud-home';
import { AdminLogin } from './admin/admin-login/admin-login';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { AdminSidebar } from './admin/admin-sidebar/admin-sidebar';
import { StudRegistration } from './student/stud-registration/stud-registration';
import { StudSignIn } from './student/stud-sign-in/stud-sign-in';
import { ManageApplication } from './admin/manage-application/manage-application';
import { TeacherPortal } from './teacher/teacher-portal/teacher-portal';
import { TeacherRegistarion } from './teacher/teacher-registarion/teacher-registarion';
import { TeacherHeader } from './teacher/teacher-header/teacher-header';
import { TeacherDashboard } from './teacher/teacher-dashboard/teacher-dashboard';
import { TeacherLogin } from './teacher/teacher-login/teacher-login';
import { ManageTeacher } from './admin/manage-teacher/manage-teacher';
import { TeacherClasses } from './teacher/teacher-classes/teacher-classes';
import { TeacherClassContent } from './teacher/teacher-class-content/teacher-class-content';

export const routes: Routes = [

  // Default page
  { path: '', redirectTo: 'student/stud-home', pathMatch: 'full' },


  // ================= ADMIN ROUTES =================
  { path: 'admin/admin-login', component: AdminLogin },
  { path: 'admin/admin-dashboard', component: AdminDashboard },
  { path: 'admin/admin-sidebar', component: AdminSidebar },
  { path: 'admin/manage-application', component: ManageApplication },
  { path: 'admin/manage-teacher', component: ManageTeacher },



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
  //TEACHER ROUTES
  { path: '', component: TeacherPortal },
  { path: 'teacher/teacher-dashboard', component: TeacherDashboard },
  { path: 'teacher/teacher-header', component: TeacherHeader },
  { path: 'teacher/teacher-portal', component: TeacherPortal },
  { path: 'teacher/teacher-registarion', component: TeacherRegistarion },
  { path: 'teacher/teacher-login', component: TeacherLogin },
  { path: 'teacher/teacher-classes', component: TeacherClasses },
  { path: 'teacher/teacher-class-content', component: TeacherClassContent },
   


  // Fallback
  { path: '**', redirectTo: 'student/stud-home' },
];

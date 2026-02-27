import { Routes } from '@angular/router';
import { StudentHeader } from './student/student-header/student-header';
import { About } from './student/about/about';
import { StudHome } from './student/stud-home/stud-home';
import { AdminLogin } from './admin/admin-login/admin-login';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { AdminSidebar } from './admin/admin-sidebar/admin-sidebar';
import { StudRegistration } from './student/stud-registration/stud-registration';
import { StudSignIn } from './student/stud-sign-in/stud-sign-in';

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

  // Fallback
  { path: '**', redirectTo: 'student/stud-home' },



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
  }
];

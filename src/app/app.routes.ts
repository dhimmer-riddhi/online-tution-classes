import { Routes } from '@angular/router';
import { StudentHeader } from './student/student-header/student-header';
import { About } from './student/about/about';
import { StudHome } from './student/stud-home/stud-home';
import { AdminLogin } from './admin/admin-login/admin-login';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';

export const routes: Routes = [

    // Default page
    { path: '', redirectTo: 'student/stud-home', pathMatch: 'full' },

    // ================= STUDENT =================
    { path: 'student/student-header', component: StudentHeader },
    { path: 'student/about', component: About },
    {path:'student/stud-home',component:StudHome},

  // ================= ADMIN =================
  { path: 'admin/admin-login', component: AdminLogin },
    { path: 'admin/admin-dashboard', component: AdminDashboard },

    // Fallback
    { path: '**', redirectTo: 'student/stud-home' }

];
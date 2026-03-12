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
import { StudFooter } from './student/stud-footer/stud-footer';
import { StudStandard } from './student/stud-standard/stud-standard';
import { Slider } from './student/slider/slider';
import { Student } from './teacher/student/student';
import { Quize } from './teacher/quize/quize';


export const routes: Routes = [

  // Default page
  { path: '', redirectTo: 'student/stud-home', pathMatch: 'full' },

  // ================= STUDENT =================

  { path: 'student/student-header', component: StudentHeader },
  { path: 'student/stud-registration', component: StudRegistration },
  { path: 'student/stud-sign-in', component: StudSignIn },
  { path: 'student/about', component: About },
  { path: 'student/stud-home', component: StudHome },
  { path: 'student/slider', component: Slider },

  // ================= STUDENT CLASSES LOAD COMPONENT =================


  {
    path: 'student/classes/ninth',
    loadComponent: () => import('./student/classes/ninth/ninth').then(m => m.Ninth)
  },
  {
    path: 'student/classes/tenth-gseb',
    loadComponent: () => import('./student/classes/tenth-gseb/tenth-gseb').then(m => m.TenthGseb)
  },
  {
    path: 'student/classes/tenth-cbse',
    loadComponent: () => import('./student/classes/tenth-cbse/tenth-cbse').then(m => m.TenthCbse)
  },
  {
    path: 'student/classes/eleventh-commerce',
    loadComponent: () => import('./student/classes/eleventh-commerce/eleventh-commerce').then(m => m.EleventhCommerce)
  },
  {
    path: 'student/classes/eleventh-pcm',
    loadComponent: () => import('./student/classes/eleventh-pcm/eleventh-pcm').then(m => m.EleventhPcm)
  },
  {
    path: 'student/classes/eleventh-pcb',
    loadComponent: () => import('./student/classes/eleventh-pcb/eleventh-pcb').then(m => m.EleventhPcb)
  },
  {
    path: 'student/classes/twelv-commerce',
    loadComponent: () => import('./student/classes/twelv-commerce/twelv-commerce').then(m => m.TwelvCommerce)
  },
  {
    path: 'student/classes/twelv-pcm',
    loadComponent: () => import('./student/classes/twelv-pcm/twelv-pcm').then(m => m.TwelvPcm)
  },

  { path: 'student/stud-standard', component: StudStandard },
  { path: 'student/stud-footer', component: StudFooter },


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
  { path: 'teacher/student', component: Student },
  { path: 'teacher/quize', component: Quize },



  // Fallback
  { path: '**', redirectTo: 'student/stud-home' },
];

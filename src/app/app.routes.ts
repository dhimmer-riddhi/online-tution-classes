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
import { TeacherHeader } from './teacher/teacher-header/teacher-header';
import { TeacherDashboard } from './teacher/teacher-dashboard/teacher-dashboard';
import { TeacherLogin } from './teacher/teacher-login/teacher-login';
import { ManageTeacher } from './admin/manage-teacher/manage-teacher';
import { TeacherClasses } from './teacher/teacher-classes/teacher-classes';
import { TeacherClassContent } from './teacher/teacher-class-content/teacher-class-content';
import { StudFooter } from './student/stud-footer/stud-footer';
import { StudStandard } from './student/stud-standard/stud-standard';
import { Slider } from './student/slider/slider';
import { TeacherStudents } from './teacher/teacher-students/teacher-students';
import { TeacherRegistration } from './teacher/teacher-registration/teacher-registration';
import { TeacherAttendance } from './teacher/teacher-attendance/teacher-attendance';
import { TeacherCourses } from './teacher/teacher-courses/teacher-courses';
import { TeacherAssignment } from './teacher/teacher-assignment/teacher-assignment';
import { TeacherQuiz } from './teacher/teacher-quiz/teacher-quiz';
import { TeacherReports } from './teacher/teacher-reports/teacher-reports';


export const routes: Routes = [

  // Default page
  { path: '', redirectTo: 'student/stud-home', pathMatch: 'full' },

  // ================= STUDENT =================
  
  { path: 'student/student-header', component: StudentHeader },
  { path: 'student/stud-registration', component: StudRegistration},
  { path: 'student/stud-sign-in', component: StudSignIn},
  { path: 'student/about', component: About },
  { path: 'student/stud-home', component: StudHome },
  { path: 'student/slider', component: Slider },

  // ================= STUDENT CLASSES LOAD COMPONENT =================

  
  {
    path:'student/classes/ninth',
     loadComponent: () => import('./student/classes/ninth/ninth').then(m => m.Ninth)
  },
  {
    path:'student/classes/tenth-gseb', 
    loadComponent: () => import('./student/classes/tenth-gseb/tenth-gseb').then(m => m.TenthGseb)
  },
  {
    path:'student/classes/tenth-cbse', 
    loadComponent: () => import('./student/classes/tenth-cbse/tenth-cbse').then(m => m.TenthCbse)
  },
  {
    path:'student/classes/eleventh-commerce', 
    loadComponent: () => import('./student/classes/eleventh-commerce/eleventh-commerce').then(m => m.EleventhCommerce)
  },
  {
    path:'student/classes/eleventh-pcm', 
    loadComponent: () => import('./student/classes/eleventh-pcm/eleventh-pcm').then(m => m.EleventhPcm)
  },
  {
    path:'student/classes/eleventh-pcb', 
    loadComponent: () => import('./student/classes/eleventh-pcb/eleventh-pcb').then(m => m.EleventhPcb)
  },
  {
    path:'student/classes/twelv-commerce', 
    loadComponent: () => import('./student/classes/twelv-commerce/twelv-commerce').then(m => m.TwelvCommerce)
  },
  {
    path:'student/classes/twelv-pcm', 
    loadComponent: () => import('./student/classes/twelv-pcm/twelv-pcm').then(m => m.TwelvPcm)
  },
  
  { path: 'student/stud-standard', component: StudStandard },
  { path: 'student/stud-footer', component: StudFooter },
    

  // ================= ADMIN ROUTES =================
  { path: 'admin/admin-login', component: AdminLogin },
  { path: 'admin/admin-dashboard', component: AdminDashboard },
  { path: 'admin/admin-sidebar', component: AdminSidebar },
  { path: 'admin/manage-teacher', component: ManageTeacher },

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
  
      // { path: 'teacher/teacher-portal', component: TeacherPortal },
      // { path: 'teacher/teacher-login', component: TeacherLogin },
      // { path: 'teacher/teacher-registration', component: TeacherRegistration },

      // // WITH SIDEBAR (Main Dashboard Layout)
      
      //     { path: 'teacher/teacher-header',component: TeacherHeader},
      //     { path: 'teacher/dashboard', component: TeacherDashboard },
      //     { path: 'teacher/students', component: TeacherStudents },
      //     { path: 'teacher/attendance', component: TeacherAttendance },
      //     { path: 'teacher/classes', component: TeacherClasses },
      //     { path: 'teacher/class-content', component: TeacherClassContent },
      //     { path: 'teacher/courses', component: TeacherCourses },
      //     { path: 'teacher/assignment', component: TeacherAssignment },
      //     { path: 'teacher/quiz', component: TeacherQuiz },
      //     { path: 'teacher/reports', component: TeacherReports },
          

  { path: 'teacher/teacher-portal', component: TeacherPortal },
  { path: 'teacher/teacher-login', component: TeacherLogin },
  { path: 'teacher/teacher-registration', component: TeacherRegistration },

  // ===== TEACHER PANEL (HEADER + SIDEBAR + CONTENT) =====

  {
    path: 'teacher',
    component: TeacherHeader,

    children: [

      { path: 'dashboard', component: TeacherDashboard },
      { path: 'students', component: TeacherStudents },
      { path: 'attendance', component: TeacherAttendance },
      { path: 'classes', component: TeacherClasses },
      { path: 'class-content', component: TeacherClassContent },
      { path: 'courses', component: TeacherCourses },
      { path: 'assignment', component: TeacherAssignment },
      { path: 'quiz', component: TeacherQuiz },
      { path: 'reports', component: TeacherReports },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }

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

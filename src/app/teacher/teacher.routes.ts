import { Routes } from '@angular/router';
import { TeacherPortal } from './teacher-portal/teacher-portal';
import { TeacherRegistration } from './teacher-registration/teacher-registration';
import { TeacherLogin } from './teacher-login/teacher-login';

export const TEACHER_ROUTES: Routes = [
  { path: 'teacher-portal', component: TeacherPortal },
  { path: 'teacher-registration', component: TeacherRegistration },
  { path: 'teacher-login', component: TeacherLogin }
];
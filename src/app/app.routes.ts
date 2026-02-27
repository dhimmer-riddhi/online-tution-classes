import { Routes } from '@angular/router';
import { StudentHeader } from './student/student-header/student-header';
import { About } from './student/about/about';
import { StudHome } from './student/stud-home/stud-home';
import { StudRegistration } from './student/stud-registration/stud-registration';
import { StudSignIn } from './student/stud-sign-in/stud-sign-in';

export const routes: Routes = [
    // STUDENT ROUTES HERE
    
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
    }
];

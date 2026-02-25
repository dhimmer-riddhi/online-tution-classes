import { Routes } from '@angular/router';
import { StudentHeader } from './student/student-header/student-header';
import { About } from './student/about/about';
import { StudHome } from './student/stud-home/stud-home';

export const routes: Routes = [
    // STUDENT ROUTES HERE
    
    {
        path:'student/student-header',
        component: StudentHeader
    },
    {
        path:'student/stud-home',
        component: StudHome
    },
    {
        path:'student/about',
        component: About
    }
];

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const studentAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const student = localStorage.getItem("student");

  if (student) {
    return true;
  } else {
    router.navigate(['/student/stud-sign-in']);
    return false;
  }
};
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';

declare var bootstrap: any;

@Component({
  selector: 'app-teacher-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './teacher-login.html',
  styleUrl: './teacher-login.css',
})
export class TeacherLogin {
   loginForm: FormGroup;
  @ViewChild('saveToast') saveToast!: ElementRef;
  toastMessage = '';

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({

      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]

    });

  }
  showToast(message: string) {

    this.toastMessage = message;

    setTimeout(() => {

      const toast = new bootstrap.Toast(
        this.saveToast.nativeElement,
        { delay: 3000 }
      );

      toast.show();

    }, 100);

  }
  loginTeacher() {
    if (this.loginForm.invalid) {
      this.showToast("Please fill all fields");
      return;
    }
    const email = this.loginForm.value.email.trim().toLowerCase();
    const password = this.loginForm.value.password.trim();

    this.firebaseService
      .getDocumentsByField<any>(
        FirebaseCollections.Teachers,
        'email',
        email
      )
      .subscribe({

        next: (teachers) => {

          if (!teachers || teachers.length === 0) {
            this.showToast("Account not found");
            return;
          }

          // ⭐ latest teacher record
          const teacher = teachers[teachers.length - 1];

          const firebasePassword =
            (teacher.password ?? '').toString().trim();

          if (firebasePassword !== password) {
            this.showToast("Invalid password");
            return;
          }
          if (teacher.status !== 'approved') {
            this.showToast("Account not approved yet");
            return;
          }
          sessionStorage.setItem("teacherName", teacher.teacherName);
          sessionStorage.setItem("teacherSubject", teacher.subjects);
          localStorage.setItem("teacherId", teacher.id);
          this.showToast("Login successful");
          setTimeout(() => {
            this.router.navigate(['/teacher/dashboard']);
          }, 1000);

        },
        error: (err) => {
          console.error(err);
          this.showToast("Technical error");
        }

      });
  }

}
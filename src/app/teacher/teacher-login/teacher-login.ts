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
      if (this.saveToast) {
        const toast = new bootstrap.Toast(this.saveToast.nativeElement, {
          delay: 3000
        });
        toast.show();
      }
    }, 100);
  }

  async loginTeacher() {
    if (this.loginForm.invalid) {
      this.showToast('Please fill all fields correctly');
      return;
    }

    try {
      const email = this.loginForm.value.email.trim().toLowerCase();
      const password = this.loginForm.value.password.trim();

      // ✅ Using your existing service method: getDocumentsByField
      // Isse "Property does not exist" wala error nahi aayega
      const teachers = await firstValueFrom(
        this.firebaseService.getDocumentsByField<any>(
          FirebaseCollections.Teachers, 
          'email', 
          email
        )
      );

      // Check if teacher exists
      const teacher = teachers && teachers.length > 0 ? teachers[0] : null;

      if (!teacher) {
        this.showToast('Account not found.');
        return;
      }

      // Password and Status Check
      if (teacher.password !== password) {
        this.showToast('Invalid password.');
        return;
      }

      if (teacher.status !== "approved") {
        this.showToast('Your account is pending approval.');
        return;
      }

      // Success Logic
      const nameToSave = teacher.teacherName || "Teacher";
      sessionStorage.setItem("teacherName", nameToSave); 
      localStorage.setItem("teacherId", teacher.id);

      this.showToast('Login Success! Welcome ' + nameToSave);

      setTimeout(() => {
        this.router.navigate(['/teacher/dashboard']);
      }, 1000);

    } catch (error) {
      console.error("Login Error:", error);
      this.showToast('Technical error. Please try again later.');
    }
  }
}
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
declare var bootstrap: any
@Component({
  selector: 'app-teacher-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './teacher-login.html',
  styleUrl: './teacher-login.css',
})
export class TeacherLogin {
  loginForm!: FormGroup;

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
      const toast = new bootstrap.Toast(this.saveToast.nativeElement, {
        delay: 3000
      });
      toast.show();
    }, 100);
  }

  async loginTeacher() {
    if (this.loginForm.invalid) {
      this.showToast('Please fill all fields correctly');
      return;
    }

    try {
      const teachers = await firstValueFrom(
        this.firebaseService.getCollection<any>(FirebaseCollections.Teachers)
      );

      const email = this.loginForm.value.email.trim().toLowerCase();
      const password = this.loginForm.value.password.trim();

      const teacher = teachers.find(t =>
        t.email?.toLowerCase() === email &&
        t.password === password &&
        t.status === "approved"
      );

      if (!teacher) {
        this.showToast('Invalid login or account not approved yet.');
        return;
      }

      // ✅ FIXED: Aapke Firebase mein field 'teacherName' hai
      const nameToSave = teacher.teacherName || "Teacher";
      
      sessionStorage.setItem("teacherName", nameToSave); 
      localStorage.setItem("teacherId", teacher.id);

      this.showToast('Login Success! Welcome'  + nameToSave);
      this.router.navigate(['/teacher/dashboard']);

    } catch (error) {
      console.error("Login Error:", error);
      this.showToast('Technical error. Please try again later.');
    }
  }
}
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';

@Component({
  selector: 'app-teacher-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './teacher-login.html',
  styleUrls: ['./teacher-login.css']
})
export class TeacherLogin {

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({
      teacherId: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async loginTeacher() {

    if (!this.loginForm.valid) {
      alert("Please fill all fields");
      return;
    }

    try {

      const teachers = await firstValueFrom(
        this.firebaseService.getCollection<any>(FirebaseCollections.Teachers)
      );

      const teacher = teachers.find(
        t =>
          t.teacherId === this.loginForm.value.teacherId &&
          t.password === this.loginForm.value.password
      );

      if (!teacher) {
        alert("Invalid Credentials");
        return;
      }

      // ✅ Save Logged In Teacher Firestore Document ID
      localStorage.setItem('teacherId', teacher.id);

      alert("Login Successful!");

      // ✅ Redirect to Dashboard
      this.router.navigate(['/teacher/dashboard']);

    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  }
}
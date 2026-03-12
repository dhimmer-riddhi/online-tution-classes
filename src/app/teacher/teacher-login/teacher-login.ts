import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { email } from '@angular/forms/signals';

@Component({
  selector: 'app-teacher-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './teacher-login.html',
  styleUrl: './teacher-login.css',
})
export class TeacherLogin {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async loginTeacher() {

    if (this.loginForm.invalid) {
      alert("Fill all fields");
      return;
    }

    const teachers = await firstValueFrom(
      this.firebaseService.getCollection<any>(FirebaseCollections.Teachers)
    );

    console.log("Teachers:", teachers);

    const email = this.loginForm.value.email.trim().toLowerCase();
    const password = this.loginForm.value.password.trim();

    const teacher = teachers.find(t =>
      t.email?.toLowerCase() === email &&
      t.password === password &&
      t.status === "approved"
    );

    if (!teacher) {
      alert("Invalid login or teacher not approved");
      return;
    }

    localStorage.setItem("teacherId", teacher.id);

    alert("Login Success");

    this.router.navigate(['/teacher/teacher-dashboard']);

  }
}

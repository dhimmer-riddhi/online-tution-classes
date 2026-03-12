import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentHeader } from "../student-header/student-header";
import { StudFooter } from "../stud-footer/stud-footer";
import { FirebaseService } from '../../firebase-service/firebase-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stud-sign-in',
  imports: [ReactiveFormsModule, StudentHeader, StudFooter],
  templateUrl: './stud-sign-in.html',
  styleUrl: './stud-sign-in.css',
})
export class StudSignIn implements OnInit{
 loginForm!: FormGroup;

  private fb = inject(FormBuilder);
  private firebaseService = inject(FirebaseService);
  private router = inject(Router);

  students:any[] = [];

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    // 🔥 Firebase thi students load
  this.firebaseService.getStudents().subscribe(data=>{
    console.log("Students from Firebase:", data);
    this.students = data;
  });
  }

  onLogin() {

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  const email = this.loginForm.value.email.trim().toLowerCase();
  const password = this.loginForm.value.password.trim();

  const student = this.students.find(
    s =>
      s.email?.trim().toLowerCase() === email &&
      s.password?.trim() === password
  );

  console.log("Matched Student:", student);

  if (!student) {
    alert("❌ Invalid Email or Password");
    return;
  }

  if (student.status !== 'approved') {
    alert("⏳ Your account is not approved yet.");
    return;
  }

  alert("Login Successful ✅");

  localStorage.setItem("student", JSON.stringify(student));

  this.router.navigate(['/student/stud-dashboard']);
}
}
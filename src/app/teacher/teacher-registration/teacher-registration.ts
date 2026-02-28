import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';

@Component({
  selector: 'app-teacher-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './teacher-registration.html',
  styleUrls: ['./teacher-registration.css']
})
export class TeacherRegistration {

  registerForm!: FormGroup;
  step = 1;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router
  ) {

    this.registerForm = this.fb.group({
      teacherName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      gender: ['', Validators.required],

      teacherId: ['', Validators.required],
      subjects: ['', Validators.required],
      experience: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  nextStep() {
    if (
      this.registerForm.get('teacherName')?.valid &&
      this.registerForm.get('email')?.valid &&
      this.registerForm.get('mobile')?.valid
    ) {
      this.step = 2;
    } else {
      alert("Please fill all required personal details");
    }
  }

  previousStep() {
    this.step = 1;
  }

  async registerTeacher() {

    if (!this.registerForm.valid) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const teachers = await firstValueFrom(
        this.firebaseService.getCollection<any>(FirebaseCollections.Teachers)
      );

      const exists = teachers.find(
        t => t.teacherId === this.registerForm.value.teacherId
      );

      if (exists) {
        alert("Teacher already registered!");
        return;
      }

      await this.firebaseService.addDocument(
        FirebaseCollections.Teachers,
        this.registerForm.value
      );

      alert("Registration Successful!");
      this.router.navigate(['/teacher/teacher-login']);

    } catch (error) {
      alert("Registration error");
      console.error(error);
    }
  }
}
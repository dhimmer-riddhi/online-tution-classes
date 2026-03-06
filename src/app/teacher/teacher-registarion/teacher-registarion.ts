import { Component } from '@angular/core';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-registarion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './teacher-registarion.html',
  styleUrl: './teacher-registarion.css',
})
export class TeacherRegistarion {

  registerForm!: FormGroup;
  step = 1;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router
  ) {

    this.registerForm = this.fb.group({
      // Step 1
      teacherName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      gender: ['', Validators.required],

      // Step 2
      teacherId: ['', Validators.required],
      subjects: ['', Validators.required],
      experience: ['', Validators.required],
    });
  }

  // ✅ STEP 1 VALIDATION
  nextStep() {

    if (
      this.registerForm.get('teacherName')?.invalid ||
      this.registerForm.get('email')?.invalid ||
      this.registerForm.get('mobile')?.invalid ||
      this.registerForm.get('gender')?.invalid
    ) {
      alert("Please fill all required personal details");
      return;
    }

    this.step = 2;
  }

  previousStep() {
    this.step = 1;
  }

  // ✅ FINAL SUBMIT
  async registerTeacher() {

    if (
      this.registerForm.get('teacherId')?.invalid ||
      this.registerForm.get('subjects')?.invalid ||
      this.registerForm.get('experience')?.invalid
    ) {
      alert("Please fill all required professional details");
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
        alert("Teacher ID already registered!");
        return;
      }

      const teacherData = {
        ...this.registerForm.value,
        status: 'pending',
        role: 'teacher',
        createdAt: new Date()
      };

      await this.firebaseService.addDocument(
        FirebaseCollections.Teachers,
        teacherData
      );

      alert("Registration Submitted! Wait for Admin Approval.");

      this.registerForm.reset();
      this.step = 1;

      this.router.navigate(['/teacher/teacher-login']);

    } catch (error) {
      alert("Registration error");
      console.error(error);
    }
  }
}
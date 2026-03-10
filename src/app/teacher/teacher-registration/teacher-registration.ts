import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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

  selectedCV: File | null = null;
  selectedPhoto: File | null = null;

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
      subjects: ['', Validators.required],
      experience: ['', Validators.required]
    });
  }

  nextStep() {
    if (
      this.registerForm.get('teacherName')?.valid &&
      this.registerForm.get('email')?.valid &&
      this.registerForm.get('mobile')?.valid &&
      this.registerForm.get('gender')?.valid
    ) {
      this.step = 2;
    } else {
      alert("Please fill all required personal details");
    }
  }

  previousStep() {
    this.step = 1;
  }

  onCvSelected(event: any) {
    this.selectedCV = event.target.files[0];
  }

  onPhotoSelected(event: any) {
    this.selectedPhoto = event.target.files[0];
  }

  generateTeacherId() {
    return 'TCH' + Math.floor(1000 + Math.random() * 9000);
  }

  generatePassword() {
    return Math.random().toString(36).slice(-8);
  }

  async registerTeacher() {

    if (!this.registerForm.valid || !this.selectedCV || !this.selectedPhoto) {
      alert("Please fill all fields and upload CV & Photo");
      return;
    }

    try {

      const teacherId = this.generateTeacherId();
      const password = this.generatePassword();

      // Upload CV
      const cvUpload = await this.firebaseService.uploadFile(
        `teacher-cv/${teacherId}`,
        this.selectedCV
      );

      // Upload Photo
      const photoUpload = await this.firebaseService.uploadFile(
        `teacher-photo/${teacherId}`,
        this.selectedPhoto
      );

      // Save Data
      await this.firebaseService.addDocument(
        FirebaseCollections.Teachers,
        {
          ...this.registerForm.value,
          teacherId,
          password,
          cvUrl: cvUpload.downloadURL,
          photoUrl: photoUpload.downloadURL,
          status: 'Pending'
        }
      );

      alert("Registration Submitted! Wait for Admin Approval.");
      this.router.navigate(['/teacher/teacher-login']);

    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  }
}
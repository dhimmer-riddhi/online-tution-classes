import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { HttpClient } from '@angular/common/http';

import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '../../../firebaseconfig';


declare var bootstrap: any;

@Component({
  selector: 'app-teacher-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './teacher-registration.html',
  styleUrls: ['./teacher-registration.css']
})
export class TeacherRegistration {

  @ViewChild('saveToast') saveToast!: ElementRef;

  toastMessage = '';

  registerForm!: FormGroup;
  step = 1;

  selectedCV: File | null = null;
  selectedPhoto: File | null = null;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private http: HttpClient,
    private router: Router
  ) {

    // ✅ Firebase initialize (only once)
    if (!getApps().length) {
      initializeApp(firebaseConfig);
    }

    this.registerForm = this.fb.group({
      teacherName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      gender: ['', Validators.required],
      subjects: ['', Validators.required],
      experience: ['', Validators.required]
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

  nextStep() {

    if (
      this.registerForm.get('teacherName')?.valid &&
      this.registerForm.get('email')?.valid &&
      this.registerForm.get('mobile')?.valid &&
      this.registerForm.get('gender')?.valid
    ) {
      this.step = 2;
    } else {
      this.showToast('Please fill all required personal details');
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

  async registerTeacher() {

    if (!this.registerForm.valid || !this.selectedCV || !this.selectedPhoto) {
      this.showToast('Please fill all fields and upload CV & Photo');
      return;
    }

    try {

      const teacherId = this.generateTeacherId();

      const cvUpload = await this.firebaseService.uploadFile(
        `teacher-cv/${teacherId}`,
        this.selectedCV
      );

      const photoUpload = await this.firebaseService.uploadFile(
        `teacher-photo/${teacherId}`,
        this.selectedPhoto
      );

      await this.firebaseService.addDocument(FirebaseCollections.Teachers, {
        teacherId,
        ...this.registerForm.value,
        cvUrl: cvUpload.downloadURL,
        photoUrl: photoUpload.downloadURL,
        status: 'pending',
        role: 'teacher',
        createdAt: new Date()
      });

      this.showToast('Registration Submitted! Wait for Admin Approval.');

      this.router.navigate(['/teacher/teacher-login']);

    } catch (error: any) {

      console.error(error);
      this.showToast(error.message);

    }

  }

}
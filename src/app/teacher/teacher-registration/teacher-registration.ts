import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '../../../firebaseconfig';

declare var bootstrap: any;

@Component({
  selector: 'app-teacher-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, HttpClientModule],
  templateUrl: './teacher-registration.html',
  styleUrls: ['./teacher-registration.css']
})
export class TeacherRegistration {
  @ViewChild('saveToast') saveToast!: ElementRef;

  toastMessage = '';
  registerForm!: FormGroup;
  step = 1;
  isUploading = false;

  selectedCV: File | null = null;
  selectedPhoto: File | null = null;
  
  // Local previews for instant viewing
  cvPreviewUrl: string | null = null;
  photoPreviewUrl: string | null = null;

  private cloudName = 'dovmj5mds';
  private uploadPreset = 'Tution_videos';

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    if (!getApps().length) {
      initializeApp(firebaseConfig);
    }

    this.registerForm = this.fb.group({
      teacherName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      gender: ['', Validators.required],
      subjects: ['', Validators.required],
      experience: ['', Validators.required]
    });
  }

  showToast(message: string) {
    this.toastMessage = message;
    this.cd.detectChanges();
    setTimeout(() => {
      const toastElement = this.saveToast.nativeElement;
      const existingToast = bootstrap.Toast.getInstance(toastElement);
      if (existingToast) existingToast.dispose();
      const toast = new bootstrap.Toast(toastElement, { delay: 4000, autohide: true });
      toast.show();
    }, 100);
  }

  // Instant local preview logic
  onCvSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedCV = file;
      // Object URL generate karna file dekhne ke liye
      this.cvPreviewUrl = URL.createObjectURL(file);
    }
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedPhoto = file;
      // Object URL generate karna photo dekhne ke liye
      this.photoPreviewUrl = URL.createObjectURL(file);
    }
  }

  // File open karne ke liye helper function
  viewFile(url: string | null) {
    if (url) {
      window.open(url, '_blank');
    }
  }

  async uploadToCloudinary(file: File): Promise<string> {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', 'Tution_videos');

    const response = await fetch(url, { method: 'POST', body: formData });
    if (!response.ok) throw new Error('Cloudinary upload failed');
    const data = await response.json();
    return data.secure_url;
  }

  async registerTeacher() {
    if (!this.registerForm.valid || !this.selectedCV || !this.selectedPhoto) {
      this.showToast('Please fill all fields and upload CV & Photo');
      return;
    }

    if (this.isUploading) return;
    this.isUploading = true;

    try {
      const cvUrl = await this.uploadToCloudinary(this.selectedCV);
      const photoUrl = await this.uploadToCloudinary(this.selectedPhoto);

      await this.firebaseService.addDocument(FirebaseCollections.Teachers, {
        teacherId: 'TCH' + Math.floor(1000 + Math.random() * 9000),
        ...this.registerForm.value,
        cvUrl,
        photoUrl,
        status: 'pending',
        role: 'teacher',
        createdAt: new Date().toISOString()
      });

      this.showToast('Registration Successful! Wait for Admin Approval.');
      setTimeout(() => this.router.navigate(['/teacher/teacher-login']), 5000);

    } catch (error: any) {
      this.showToast('Error: ' + error.message);
    } finally {
      this.isUploading = false;
    }
  }

  nextStep() { this.step = 2; }
  previousStep() { this.step = 1; }
}
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { FirebaseService } from '../../firebase-service/firebase-service';
import { StudentRegistration } from '../../interface/student-registration.interface';
import { StudentHeader } from "../student-header/student-header";
import { StudFooter } from "../stud-footer/stud-footer";
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { Router } from '@angular/router';


@Component({
  selector: 'app-stud-registration',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, StudentHeader, StudFooter],
  templateUrl: './stud-registration.html',
  styleUrl: './stud-registration.css',
})

export class StudRegistration implements OnInit {

  private fb = inject(FormBuilder);
  private firebaseService = inject(FirebaseService);

  registerForm!: FormGroup;

  step = 1;
  isLoading = false;

  // 🔥 Courses & Subjects
  courses: any[] = [];
  availableSubjects: string[] = [];
  selectedSubjects: string[] = [];
  private router = inject(Router);

  constructor() {

    this.registerForm = this.fb.group({

      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],

      standard: ['', Validators.required],
      board: ['', Validators.required],
      stream: ['', Validators.required],
      scienceGroup: [''],

      subjects: [[], Validators.required]

    });

    // 🔹 Science Group Validation
    this.registerForm.get('stream')?.valueChanges.subscribe(value => {

      const scienceControl = this.registerForm.get('scienceGroup');

      if (value === 'Science') {
        scienceControl?.setValidators([Validators.required]);
      } else {
        scienceControl?.clearValidators();
        scienceControl?.setValue('');
      }

      scienceControl?.updateValueAndValidity();

    });

  }

  // ===============================
  // 🔥 LOAD COURSES FROM FIREBASE
  // ===============================

  ngOnInit() {

    this.firebaseService
      .getCollection<any>(FirebaseCollections.Courses)
      .subscribe(data => {

        this.courses = data;

      });

    // 🔥 STANDARD CHANGE → SUBJECT FILTER
    this.registerForm.get('standard')?.valueChanges.subscribe(std => {

  this.availableSubjects = [];
  this.selectedSubjects = [];

  if (std === '10th') {
    this.registerForm.get('board')?.setValidators([Validators.required]);
    this.registerForm.get('stream')?.clearValidators();
  }

  if (std === '11th' || std === '12th') {
    this.registerForm.get('stream')?.setValidators([Validators.required]);
    this.registerForm.get('board')?.clearValidators();
  }

  this.registerForm.get('board')?.updateValueAndValidity();
  this.registerForm.get('stream')?.updateValueAndValidity();



});
this.registerForm.get('board')?.valueChanges.subscribe(board => {

  const std = this.registerForm.get('standard')?.value;

  if (std === '10th') {

    const filteredCourses = this.courses.filter(
      course => course.class === '10th' && course.board === board
    );

    this.availableSubjects = filteredCourses.map(course => course.title);

  }

});
this.registerForm.get('stream')?.valueChanges.subscribe(stream => {

  const std = this.registerForm.get('standard')?.value;

  if (std === '11th' || std === '12th') {

    if (stream === 'Science') {

      // Science subjects (PCM + PCB)
      const filteredCourses = this.courses.filter(
        course =>
          course.class === std &&
          (course.stream === 'PCM' || course.stream === 'PCB')
      );

      this.availableSubjects = filteredCourses.map(course => course.title);

    } else {

      // Commerce / Arts
      const filteredCourses = this.courses.filter(
        course => course.class === std && course.stream === stream
      );

      this.availableSubjects = filteredCourses.map(course => course.title);

    }

  }

});
  }

  

  // ===============================
  // 🔹 SUBJECT CHECKBOX HANDLER
  // ===============================

  toggleSubject(event: any, subject: string) {

    if (event.target.checked) {

      this.selectedSubjects.push(subject);

    } else {

      this.selectedSubjects = this.selectedSubjects.filter(
        s => s !== subject
      );

    }

    // 🔥 Form control update
    this.registerForm.patchValue({
      subjects: this.selectedSubjects
    });

  }

  // ===============================
  // 🔹 STEP 1 → STEP 2 VALIDATION
  // ===============================

  nextStep() {

    if (this.step === 1) {

      const personalFields = [
        'fullName',
        'email',
        'mobile',
        'dob',
        'gender',
        'city',
        'state'
      ];

      const isStepOneValid = personalFields.every(field =>
        this.registerForm.get(field)?.valid
      );

      if (isStepOneValid) {

        this.step = 2;
        window.scrollTo({ top: 0, behavior: 'smooth' });

      } else {

        alert("Please fill all required personal details properly.");
        this.registerForm.markAllAsTouched();

      }

    }

  }

  // ===============================
  // 🔹 BACK BUTTON
  // ===============================

  previousStep() {

    this.step = 1;
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }

  // ===============================
  // 🔹 SUBMIT FORM
  // ===============================

  async onSubmit() {

    if (this.registerForm.invalid) {

      alert("Please fill all required fields.");
      this.registerForm.markAllAsTouched();
      return;

    }

    this.isLoading = true;

    const formData: StudentRegistration = {

      ...this.registerForm.value,
      subjects: this.selectedSubjects,
      status: 'pending',
      createdAt: new Date()

    };

    try {

      await this.firebaseService.addStudent(formData);

      alert("🎉 Registration Successful!");

      this.registerForm.reset();
      this.selectedSubjects = [];
      this.step = 1;

      // 🔥 Redirect
      this.router.navigate(['/student/stud-sign-in']);

    } catch (error) {

      console.error("Firebase Error:", error);
      alert("❌ Error saving data. Try again.");


    } finally {

      this.isLoading = false;

    }

  }

}

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
import { Router, RouterLink } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-stud-registration',
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
  transactionId = "";   // payment system
  availableSubjects: any[] = [];
  selectedSubjects: string[] = [];
   selectedFile: File | null = null;
imagePreview: string | null = null;
base64Image: string | null = null;
toastMessage = "";
@ViewChild('toastRef') toastRef!: ElementRef;


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
  this.registerForm.patchValue({ subjects: [] });

  if (std === '9th') {
    // hide board & stream validators
    this.registerForm.get('board')?.clearValidators();
    this.registerForm.get('board')?.setValue('');
    this.registerForm.get('board')?.updateValueAndValidity();

    this.registerForm.get('stream')?.clearValidators();
    this.registerForm.get('stream')?.setValue('');
    this.registerForm.get('stream')?.updateValueAndValidity();

    // 9th subjects fetch
    const filteredCourses = this.courses.filter(course => course.class === '9th');
    this.availableSubjects = filteredCourses;
  }
});
this.registerForm.get('board')?.valueChanges.subscribe(board => {

  const std = this.registerForm.get('standard')?.value;

  if (std === '10th') {

    const filteredCourses = this.courses.filter(
      course => course.class === '10th' && course.board === board
    );

    this.availableSubjects = filteredCourses;

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

      this.availableSubjects = filteredCourses;

    } else {

      // Commerce / Arts
      const filteredCourses = this.courses.filter(
        course => course.class === std && course.stream === stream
      );

      this.availableSubjects = filteredCourses;

    }

  }

});
  }

  

  // ===============================
  // 🔹 SUBJECT CHECKBOX HANDLER
  // ===============================

  toggleSubject(event: any, subject: string) {

  if (event.target.checked) {

    if (!this.selectedSubjects.includes(subject)) {
      this.selectedSubjects.push(subject);
    }

  } else {

    this.selectedSubjects = this.selectedSubjects.filter(
      s => s !== subject
    );

  }

  this.registerForm.patchValue({
    subjects: [...this.selectedSubjects]
  });

}

  // ===============================
  // 🔹 STEP 1 → STEP 2 VALIDATION
  // ===============================

  nextStep() {
  if (this.step === 1) {
    const personalFields = ['fullName', 'email', 'mobile', 'dob', 'gender', 'city', 'state'];

    for (let field of personalFields) {
      if (!this.registerForm.get(field)?.valid) {
        let fieldName = this.getFieldLabel(field);
        this.showToast(`Please fill your ${fieldName}`);
        return;
      }
    }

    this.step = 2;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Add helper function
getFieldLabel(field: string) {
  const map: any = {
    fullName: "full name",
    email: "email",
    mobile: "mobile number",
    dob: "date of birth",
    gender: "gender",
    city: "city",
    state: "state"
  };
  return map[field] || field;
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

      this.showToast("Please fill all required fields");
      this.registerForm.markAllAsTouched();
      return;

    }

    this.isLoading = true;

    const formData: StudentRegistration = {

      ...this.registerForm.value,
      subjects: this.selectedSubjects,
      profileImage: this.base64Image, 
      transactionId: this.transactionId,   //  payment field
      paymentStatus: "pending",            //  payment status
      status: 'pending',
      createdAt: new Date()

    };

    try {

  await this.firebaseService.addStudent(formData);

  this.showToast("Registration Successful!");

  setTimeout(() => {

    this.registerForm.reset();
    this.selectedSubjects = [];
    this.step = 1;

    this.router.navigate(['/student/stud-sign-in']);

  }, 4000);

} catch (error) {

  // console.error("Firebase Error:", error);
  this.showToast("Error saving data. Try again.");



    } finally {

      this.isLoading = false;

    }

  }
 
  onFileSelected(event: any) {

  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {

    this.imagePreview = reader.result as string;
    this.base64Image = reader.result as string;

  };

  reader.readAsDataURL(file);

}
                                                      // payment system

goToPayment(){

if(this.selectedSubjects.length === 0){

this.showToast("Please select subjects");

return;

}

this.step = 3;

window.scrollTo({ top: 0, behavior: 'smooth' });

}


//  totalFees 

getTotalFees(){

let total = 0;

this.availableSubjects.forEach(sub => {

if(this.selectedSubjects.includes(sub.title)){
total += Number(sub.fees);   // convert to number
}

});

return total;

}
showToast(message: string) {

  this.toastMessage = message;

  if (!this.toastRef) return;

  const toast = new bootstrap.Toast(this.toastRef.nativeElement);

  toast.show();

}
}

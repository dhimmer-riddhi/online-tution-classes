import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { StudentRegistration, StudentRegistrationStatus } from '../../interface/student-regisation';
// import { StudentRegistration, StudentRegistrationStatus } from '../../interface/studentregisation';


@Component({
  selector: 'app-stud-registration',
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './stud-registration.html',
  styleUrl: './stud-registration.css',
})
export class StudRegistration {
   registerForm!: FormGroup;
  step = 1;

  constructor(private fb: FormBuilder, private firebaseService: FirebaseService) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
     

      standard: ['', Validators.required],
      board: ['', Validators.required],
      stream: ['', Validators.required],
      scienceGroup: [''],
      subjects: ['', Validators.required]
    });

    // Science group reset logic
    this.registerForm.get('stream')?.valueChanges.subscribe(value => {
      if (value !== 'Science') {
        this.registerForm.get('scienceGroup')?.setValue('');
      }
    });
  }

  nextStep() {
    if (this.step === 1) {
      if (
        this.registerForm.get('fullName')?.valid &&
        this.registerForm.get('email')?.valid &&
        this.registerForm.get('mobile')?.valid
      ) {
        this.step = 2;
      } else {
        alert("Please fill all required personal details");
      }
    }
  }

  previousStep() {
    this.step = 1;
  }

  // onSubmit() {
  //   if (this.registerForm.valid) {
  //     console.log(this.registerForm.value);
  //     alert("Registration Successful!");
  //   } else {
  //     alert("Please fill all required fields.");
  //   }
  // }
// onSubmit() {
//   if (this.registerForm.valid) {

//     const formData: StudentRegistration = {
//       ...this.registerForm.value,
//       status: StudentRegistrationStatus.Pending,  // ✅ ENUM
//       createdAt: new Date()
//     };

//     this.firebaseService.addDocument(
//       FirebaseCollections.StudentRegistrations,
//       formData
//     ).then(() => {
//       alert("Registration Successful!");
//       this.registerForm.reset();
//       this.step = 1;
//     });

//   } else {
//     alert("Please fill all required fields.");
//   }
// }
// async onSubmit() {
//   if (this.registerForm.valid) {

//     const data: StudentRegistration = {
//       ...this.registerForm.value,
//       status: 'pending',
//       createdAt: new Date()
//     };

//     await this.firebaseService.addDocument(
//       FirebaseCollections.Students,
//       data
//     );

//     alert("Registration Successful!");
//   }
// }
async onSubmit() {
  if (this.registerForm.valid) {

    const formData: StudentRegistration = {
      ...this.registerForm.value,
      status: StudentRegistrationStatus.Pending,
      createdAt: new Date()
    };

    await this.firebaseService.addDocument(
      FirebaseCollections.StudentRegistrations,
      formData
    );

    alert("Registration Successful!");
    this.registerForm.reset();
    this.step = 1;

  } else {
    alert("Please fill all required fields.");
  }
}
}

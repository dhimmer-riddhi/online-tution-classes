import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';


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

  onSubmit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      alert("Registration Successful!");
    } else {
      alert("Please fill all required fields.");
    }
  }
}

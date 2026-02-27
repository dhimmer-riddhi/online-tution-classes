import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-stud-sign-in',
  imports: [ReactiveFormsModule],
  templateUrl: './stud-sign-in.html',
  styleUrl: './stud-sign-in.css',
})
export class StudSignIn implements OnInit{
 loginForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      alert("Login Successful ✅");
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}

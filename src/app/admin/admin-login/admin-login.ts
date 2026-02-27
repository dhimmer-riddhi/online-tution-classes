import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {
 loginForm: FormGroup;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // ✅ STATIC ADMIN LOGIN
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';

    const { email, password } = this.loginForm.value;

    if (email === adminEmail && password === adminPassword) {
      // IMPORTANT: set login flag FIRST
      localStorage.setItem('adminLogin', 'true');

      // THEN redirect
      this.router.navigateByUrl('admin-dashboard');
    } else {
      this.errorMsg = 'Invalid email or password';
    }
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { firstValueFrom } from 'rxjs';
import { Teacher } from '../../interface/teacher'; // your separate interface

@Component({
  selector: 'app-teacher-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './teacher-login.html',
  styleUrls: ['./teacher-login.css'],
})
export class TeacherLogin implements OnInit {

  // ✅ Directly define form here, no LoginForm interface
  loginForm = new FormGroup({
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    password: new FormControl<string | null>(null, Validators.required),
  });

  teacherList: Teacher[] = [];

  showToast = false;
  toastMessage = '';

  loggedIn = false;
  teacherSubjects: string[] = [];

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadTeachers();

    // ✅ Check if teacher already logged in
    const teacherId = sessionStorage.getItem('loggedInTeacherId');
    const subjectsFromStorage = sessionStorage.getItem('loggedInTeacherSubjects');
    if (teacherId && subjectsFromStorage) {
      this.loggedIn = true;
      this.teacherSubjects = subjectsFromStorage.split(',').map((s: string) => s.trim());
    } else {
      this.loggedIn = false;
      // If someone manually types URL other than /teacher/login
      if (!this.router.url.includes('/teacher/login')) {
        this.router.navigate(['/teacher/login']);
      }
    }
  }

  async loadTeachers() {
    const data = await firstValueFrom(
      this.firebaseService.getCollection<Teacher>(FirebaseCollections.Teachers)
    );
    this.teacherList = data;
  }

  // ✅ Must match template
  async loginTeacher() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.value.email!;
    const password = this.loginForm.value.password!;

    const teacher = this.teacherList.find(
      t => t.email === email && t.password === password && t.status === 'approved'
    );

    if (teacher) {
      // ✅ Save login info in sessionStorage
      sessionStorage.setItem('loggedInTeacherId', teacher.teacherId);
      sessionStorage.setItem('loggedInTeacherName', teacher.teacherName);
      sessionStorage.setItem('loggedInTeacherSubjects', teacher.subjects);

      this.teacherSubjects = teacher.subjects.split(',').map((s: string) => s.trim());
      this.loggedIn = true;

      this.router.navigate(['/teacher/dashboard']);
    } else {
      this.toastMessage = 'Email or Password Wrong / Not Approved';
      this.showToast = true;
      this.cd.detectChanges();

      setTimeout(() => {
        this.showToast = false;
        this.cd.detectChanges();
      }, 3000);
    }
  }

  logout() {
    sessionStorage.removeItem('loggedInTeacherId');
    sessionStorage.removeItem('loggedInTeacherName');
    sessionStorage.removeItem('loggedInTeacherSubjects');
    this.loggedIn = false;
    this.loginForm.reset();
    this.router.navigate(['/teacher/login']);
  }

  closeToast() {
    this.showToast = false;
  }
}
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
// import { FirebaseCollections } from '../firebase-service/firebase-enums';
import { Teacher } from '../../interface/teacher';

@Component({
  selector: 'app-teacher-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './teacher-login.html',
  styleUrls: ['./teacher-login.css']
})
export class TeacherLogin {

  teacherId: string = '';
  password: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  async loginTeacher() {
    try {
      // Fetch all teachers from Firebase
      const teachers = await firstValueFrom(
        this.firebaseService.getCollection<Teacher>(FirebaseCollections.Teachers)
      );

      // Check credentials
      const teacher = teachers.find(
        t => t.teacherId === this.teacherId && t.password === this.password
      );

      if (!teacher) {
        alert('❌ Invalid Credentials');
        return;
      }

      alert('✅ Login Successful');
      this.router.navigate(['/teacher/teacher-portal']);

    } catch (error) {
      console.error(error);
      alert('Login error');
    }
  }
}
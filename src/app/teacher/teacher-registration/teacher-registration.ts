import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { Teacher } from '../../interface/teacher';

@Component({
  selector: 'app-teacher-registration',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './teacher-registration.html',
  styleUrls: ['./teacher-registration.css'],
})
export class TeacherRegistration {

  teacher: Teacher = {
    teacherId: '',
    password: '',
    teacherName: '',
    email: '',
    role: 'teacher',
    createdAt: new Date()
  };

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  async registerTeacher() {
    try {

      // Fetch all registered teachers from Firebase
      const teachers = await firstValueFrom(
        this.firebaseService.getCollection<Teacher>(FirebaseCollections.Teachers)
      );

      // Check if teacherId already exists
      const exists = teachers.find(
        t => t.teacherId === this.teacher.teacherId
      );

      if (exists) {
        alert('❌ Teacher already registered!');
        return;
      }

      // Add new teacher to Firebase
      await this.firebaseService.addDocument(
        FirebaseCollections.Teachers,
        this.teacher
      );

      alert('✅ Registration Successful!');
      this.router.navigate(['/teacher/teacher-login']);

    } catch (error) {
      console.error(error);
      alert('Error during registration');
    }
  }
}
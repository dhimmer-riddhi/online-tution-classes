import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-header',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './teacher-header.html',
  styleUrls: ['./teacher-header.css'],
})
export class TeacherHeader implements OnInit {
  teacherData: any;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const teacherId = localStorage.getItem('teacherId');

    if (teacherId) {
      this.firebaseService
        .getDocument<any>(FirebaseCollections.Teachers, teacherId)
        .subscribe((data) => {
          this.teacherData = data;
        });
    }
  }

  logout() {
    localStorage.removeItem('teacherId');
    this.router.navigate(['/teacher/login']);
  }
}
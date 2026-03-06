import { Component } from '@angular/core';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-header',
  imports: [RouterOutlet,CommonModule,RouterModule],
  templateUrl: './teacher-header.html',
  styleUrl: './teacher-header.css',
})
export class TeacherHeader {
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
        .subscribe(data => {
          this.teacherData = data;
        });
    }
  }

  logout() {
    localStorage.removeItem('teacherId');
    this.router.navigate(['/teacher/teacher-login']);
  }
}

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



  onLogout() {
    // 1. Agar aapne Token ya User data save kiya hai to use clear karein
    localStorage.removeItem('token'); 
    sessionStorage.clear();

    // 2. Login page par redirect karein
    // Maan lijiye aapka login route '/login' hai
    this.router.navigate(['teacher/teacher-login']);
    
    console.log("User Logged Out");
  }
}
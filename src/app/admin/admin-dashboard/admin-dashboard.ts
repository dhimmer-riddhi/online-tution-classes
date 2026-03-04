import { Component, OnInit } from '@angular/core';
// import { Application } from '../../interface/application';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { AdminSidebar } from "../admin-sidebar/admin-sidebar";
import { Application } from '../../interface/application';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule, RouterModule, AdminSidebar],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard {
  today = new Date();

  totalStudents$!: Observable<number>;
  totalTeachers$!: Observable<number>;
  pendingAdmissions$!: Observable<number>;

  constructor(private firebaseService: FirebaseService) {

    // ✅ TOTAL APPROVED STUDENTS COUNT
    this.totalStudents$ = this.firebaseService
      .getCollection<Application>(FirebaseCollections.Applications)
      .pipe(
        map(applications => applications.length)
      );
    // ✅ AUTO TEACHER COUNT
    this.totalTeachers$ = this.firebaseService
      .getCollection<any>(FirebaseCollections.Teachers)
      .pipe(
        map(teachers => teachers.length)
      );

    // ✅ PENDING REGISTRATIONS COUNT
    this.pendingAdmissions$ = this.firebaseService
      .getCollection<any>(FirebaseCollections.StudentRegistrations)
      .pipe(
        map(data => data.filter(r => r.status === 'pending').length)
      );
  }
}
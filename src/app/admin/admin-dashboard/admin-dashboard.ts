import { Component, OnInit } from '@angular/core';
// import { Application } from '../../interface/application';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { AdminSidebar } from "../admin-sidebar/admin-sidebar";

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule, RouterModule, AdminSidebar],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {
  today: Date = new Date();
  totalStudents$!: Observable<number>;
  totalTeachers$!: Observable<number>;
  pendingApps$!: Observable<number>;
  totalPrograms$!: Observable<number>;
  pendingAdmissions$!: Observable<number>;
  activeCourses$!: Observable<number>;
  recentApplications$!: Observable<any[]>;

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    // Mapping collections to lengths for the stats cards
    this.totalStudents$ = this.firebaseService.getCollection(FirebaseCollections.Students).pipe(map(c => c.length));
    this.totalTeachers$ = this.firebaseService.getCollection(FirebaseCollections.Teachers).pipe(map(c => c.length));
    this.pendingApps$ = this.firebaseService
      .getCollection(FirebaseCollections.Applications)
      .pipe(
        map(apps => apps.filter((a: any) =>
          a.status && a.status.toLowerCase() === 'pending'
        ).length)
      );

    // Get the actual list for the table
    this.recentApplications$ = this.firebaseService.getCollection(FirebaseCollections.Applications);
  }
}
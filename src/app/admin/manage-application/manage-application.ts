import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { StudentRegistration, StudentRegistrationStatus } from '../../interface/student-regisation';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { Application } from '../../interface/application';
import { AdminSidebar } from "../admin-sidebar/admin-sidebar";

@Component({
  selector: 'app-manage-application',
  standalone: true,
  imports: [CommonModule, AdminSidebar],
  templateUrl: './manage-application.html',
  styleUrl: './manage-application.css',
  changeDetection: ChangeDetectionStrategy.OnPush   // 🔥 Important
})
export class ManageApplication implements OnInit {

  registrations: StudentRegistration[] = [];
  processedStudents: StudentRegistration[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private cdr: ChangeDetectorRef   // 🔥 detect change
  ) {}

  ngOnInit() {
    this.loadRegistrations();
  }

  loadRegistrations() {
    this.firebaseService
      .getCollection<StudentRegistration>(
        FirebaseCollections.StudentRegistrations
      )
      .subscribe(data => {

        this.registrations = data.filter(
          r => r.status === StudentRegistrationStatus.Pending
        );

        this.processedStudents = data.filter(
          r => r.status === StudentRegistrationStatus.Approved ||
               r.status === StudentRegistrationStatus.Rejected
        );

        this.cdr.markForCheck();  // 🔥 Force UI update instantly
      });
  }

  async approve(student: StudentRegistration) {

    await this.firebaseService.updateDocument(
      FirebaseCollections.StudentRegistrations,
      student.id!,
      { status: StudentRegistrationStatus.Approved }
    );

    const applicationData: Application = {
      studentId: student.id!,
      fullName: student.fullName,
      email: student.email,
      standard: student.standard,
      board: student.board,
      stream: student.stream,
      status: 'approved',
      appliedAt: new Date()
    };

    await this.firebaseService.addDocument(
      FirebaseCollections.Applications,
      applicationData
    );

    // No reload needed (Realtime)
  }

  async reject(student: StudentRegistration) {

    await this.firebaseService.updateDocument(
      FirebaseCollections.StudentRegistrations,
      student.id!,
      { status: StudentRegistrationStatus.Rejected }
    );
  }
}
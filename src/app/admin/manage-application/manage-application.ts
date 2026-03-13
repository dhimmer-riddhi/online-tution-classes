import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { StudentRegistration } from '../../interface/student-registration.interface';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { Application } from '../../interface/application';
import { AdminSidebar } from "../admin-sidebar/admin-sidebar";
import { Teacher } from '../../interface/teacher';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-application',
  standalone: true,
  imports: [CommonModule, AdminSidebar,FormsModule],
  templateUrl: './manage-application.html',
  styleUrl: './manage-application.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageApplication implements OnInit {

  registrations: StudentRegistration[] = [];
  processedStudents: StudentRegistration[] = [];
  teachers: Teacher[] = [];
  constructor(
    private firebaseService: FirebaseService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadRegistrations();
    this.loadTeachers();
  }

  loadRegistrations() {
    this.firebaseService
      .getCollection<StudentRegistration>(
        FirebaseCollections.StudentRegistrations
      )
      .subscribe(data => {
        this.registrations = data.filter(
          r => r.status === 'pending'
        );

        this.processedStudents = data.filter(
          r => r.status === 'approved' ||
            r.status === 'rejected'
        );

        this.cdr.markForCheck();
      });
  }
  loadTeachers() {
    this.firebaseService
      .getCollection<Teacher>(FirebaseCollections.Teachers)
      .subscribe(data => {

        this.teachers = data.filter(t => t.status === 'approved');

        this.cdr.markForCheck();
      });
  }
  // 🔥 PASSWORD GENERATOR
  generatePassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  async approve(student: StudentRegistration) {

  const password = this.generatePassword();

  // 🔹 Selected Teacher find
  const teacher = this.teachers.find(
    t => t.id === student.assignedTeacherId
  );

  // 1️⃣ Update Firebase Status
  await this.firebaseService.updateDocument(
    FirebaseCollections.StudentRegistrations,
    student.id!,
    {
      status: 'approved',
      password: password,
      assignedTeacherId: student.assignedTeacherId,
      assignedTeacherName: teacher?.teacherName
    }
  );

  // 2️⃣ Save Application Record
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

  // 3️⃣ SEND EMAIL
  try {

    await fetch('http://localhost:3000/send-teacher-approval', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: student.email,
        name: student.fullName,
        password: password
      })
    });

    alert("Student Approved & Email Sent");

  } catch (error) {
    console.error("Email Error", error);
  }

}

  async reject(student: StudentRegistration) {

    await this.firebaseService.updateDocument(
      FirebaseCollections.StudentRegistrations,
      student.id!,
      { status: 'rejected' }
    );

    // Send rejection email
    await fetch('http://localhost:3000/send-teacher-rejection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: student.email,
        name: student.fullName
      })
    });

    alert("Student Rejected");

  }

}
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StudentRegistration } from '../../interface/student-registration.interface';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { TeacherHeader } from "../teacher-header/teacher-header";
import { Quiz } from '../../interface/quiz';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student',
  imports: [TeacherHeader, FormsModule, CommonModule],
  templateUrl: './student.html',
  styleUrl: './student.css',
})
export class Student implements OnInit {
  students: StudentRegistration[] = [];

  teacherId = '';

  constructor(private firebaseService: FirebaseService) { }
  ngOnInit() {

    this.teacherId = localStorage.getItem("teacherId") || '';

    this.firebaseService
      .getCollection<StudentRegistration>(FirebaseCollections.Students)
      .subscribe(data => {

        this.students = data.filter(
          s => s.assignedTeacherId === this.teacherId
        );

        console.log("Students:", this.students);

      });

  }

  loadStudents() {

    this.firebaseService
      .getCollection<StudentRegistration>(
        FirebaseCollections.StudentRegistrations
      )
      .subscribe(data => {

        // ✅ only assigned students
        this.students = data.filter(
          s => s.assignedTeacherId === this.teacherId
        );

        console.log("Teacher Students:", this.students);
        console.log(this.students);
      });

  }
  approveStudent(student: StudentRegistration) {

    this.firebaseService.updateDocument(
      FirebaseCollections.StudentRegistrations,
      student.id!,
      {
        status: 'approved'
      }
    );

    alert("Student Approved");

  }

  rejectStudent(student: StudentRegistration) {

    this.firebaseService.updateDocument(
      FirebaseCollections.StudentRegistrations,
      student.id!,
      {
        status: 'rejected'
      }
    );

    alert("Student Rejected");

  }


}

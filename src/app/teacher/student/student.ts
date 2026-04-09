import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StudentRegistration } from '../../interface/student-registration.interface';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { Quiz } from '../../interface/quiz';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student',
  imports: [FormsModule, CommonModule],
  templateUrl: './student.html',
  styleUrl: './student.css',
})
export class Student implements OnInit {
  students: StudentRegistration[] = [];
  teacherSubject = '';

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {

    this.teacherSubject = sessionStorage.getItem("teacherSubject") || '';
    this.firebaseService
      .getCollection<StudentRegistration>(FirebaseCollections.StudentRegistrations)
      .subscribe(data => {

        console.log("All Students:", data);

        this.students = data.filter(student =>
          student.subjects?.includes(this.teacherSubject)
        );

        console.log("Filtered Students:", this.students);

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

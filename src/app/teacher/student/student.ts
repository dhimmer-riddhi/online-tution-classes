import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StudentRegistration } from '../../interface/student-registration.interface';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { TeacherHeader } from "../teacher-header/teacher-header";
import { Quiz } from '../../interface/quiz';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
declare var bootstrap: any;

@Component({
  selector: 'app-student',
  imports: [FormsModule, CommonModule,TeacherHeader],
  templateUrl: './student.html',
  styleUrl: './student.css',
})
export class Student implements OnInit {
  students: StudentRegistration[] = [];

  teacherId = '';
  
  @ViewChild('saveToast') saveToast!: ElementRef;

  toastMessage = '';


  constructor(private firebaseService: FirebaseService
    , private cd: ChangeDetectorRef
  ) { }

  showToast(message: string) {
    this.toastMessage = message;
    this.cd.detectChanges();
    setTimeout(() => {
      const toastElement = this.saveToast.nativeElement;
      const existingToast = bootstrap.Toast.getInstance(toastElement);
      if (existingToast) existingToast.dispose();
      const toast = new bootstrap.Toast(toastElement, { delay: 4000, autohide: true });
      toast.show();
    }, 100);
  }

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

    this.showToast('Student Approved');

  }

  rejectStudent(student: StudentRegistration) {

    this.firebaseService.updateDocument(
      FirebaseCollections.StudentRegistrations,
      student.id!,
      {
        status: 'rejected'
      }
    );

    this.showToast('Student Rejected');

  }


}

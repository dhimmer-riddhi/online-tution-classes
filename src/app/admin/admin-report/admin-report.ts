import { ChangeDetectorRef, Component } from '@angular/core';
import { StudentRegistration } from '../../interface/student-registration.interface';
import { Teacher } from '../../interface/teacher';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { AdminSidebar } from "../admin-sidebar/admin-sidebar";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-report',
  imports: [AdminSidebar,CommonModule,FormsModule],
  templateUrl: './admin-report.html',
  styleUrl: './admin-report.css',
})
export class AdminReport {
 students: StudentRegistration[] = [];
  teachers: Teacher[] = [];

  reportType = '';
  selectedTeacher = '';
  selectedSubject = '';
  selectedDate = '';

  filteredData: StudentRegistration[] = [];

  subjects: string[] = []; // Unique subjects list

  constructor(
    private firebaseService: FirebaseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Load students
    this.firebaseService.getCollection<StudentRegistration>(
      FirebaseCollections.StudentRegistrations
    ).subscribe(data => {
      this.students = data.filter(s => s.status === 'approved');
      this.filteredData = [...this.students];

      // Create unique subjects list
      const allSubjects = this.students.flatMap(s => s.subjects);
      this.subjects = Array.from(new Set(allSubjects));

      this.cdr.detectChanges();
    });

    // Load teachers
    this.firebaseService.getCollection<Teacher>(
      FirebaseCollections.Teachers
    ).subscribe(data => {
      this.teachers = data.filter(t => t.status === 'approved');
      this.cdr.detectChanges();
    });
  }

  applyFilter() {
    this.filteredData = this.students.filter(s => {
      const teacherMatch = !this.selectedTeacher || s.assignedTeacherName === this.selectedTeacher;
      const subjectMatch = !this.selectedSubject || s.subjects.includes(this.selectedSubject);
      const dateMatch = !this.selectedDate || new Date(s.createdAt).toDateString() === new Date(this.selectedDate).toDateString();
      return teacherMatch && subjectMatch && dateMatch;
    });
  }

}

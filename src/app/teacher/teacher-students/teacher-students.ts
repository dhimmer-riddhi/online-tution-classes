import { Component } from '@angular/core';
import { TeacherFooter } from '../teacher-footer/teacher-footer';
import { TeacherHeader } from '../teacher-header/teacher-header';

@Component({
  selector: 'app-teacher-students',
  standalone: true,
  imports: [TeacherHeader,TeacherFooter],
  templateUrl: './teacher-students.html',
  styleUrl: './teacher-students.css',
})
export class TeacherStudents {

}

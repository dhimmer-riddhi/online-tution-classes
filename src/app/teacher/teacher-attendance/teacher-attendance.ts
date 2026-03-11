import { Component } from '@angular/core';
import { TeacherFooter } from '../teacher-footer/teacher-footer';
import { TeacherHeader } from '../teacher-header/teacher-header';

@Component({
  selector: 'app-teacher-attendance',
  standalone: true,
  imports: [TeacherHeader,TeacherFooter],
  templateUrl: './teacher-attendance.html',
  styleUrl: './teacher-attendance.css',
})
export class TeacherAttendance {

}

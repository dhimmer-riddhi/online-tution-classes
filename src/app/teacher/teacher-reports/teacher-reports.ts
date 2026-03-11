import { Component } from '@angular/core';
import { TeacherFooter } from '../teacher-footer/teacher-footer';
import { TeacherHeader } from '../teacher-header/teacher-header';

@Component({
  selector: 'app-teacher-reports',
  standalone: true,
  imports: [TeacherHeader,TeacherFooter],
  templateUrl: './teacher-reports.html',
  styleUrl: './teacher-reports.css',
})
export class TeacherReports {

}

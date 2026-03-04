import { Component } from '@angular/core';
import { StudentHeader } from "../../student/student-header/student-header";
import { TeacherHeader } from "../teacher-header/teacher-header";

@Component({
  selector: 'app-teacher-dashboard',
  imports: [TeacherHeader],
  templateUrl: './teacher-dashboard.html',
  styleUrl: './teacher-dashboard.css',
})
export class TeacherDashboard {

}

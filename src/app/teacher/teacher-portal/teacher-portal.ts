import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-teacher-portal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './teacher-portal.html',
  styleUrls: ['./teacher-portal.css']
})
export class TeacherPortal {
}

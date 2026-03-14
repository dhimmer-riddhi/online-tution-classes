import { Component } from '@angular/core';
import { StudentHeader } from "../student-header/student-header";
import { StudFooter } from "../stud-footer/stud-footer";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-stud-home',
  imports: [StudentHeader, StudFooter,RouterLink],
  templateUrl: './stud-home.html',
  styleUrl: './stud-home.css',
})
export class StudHome {

}

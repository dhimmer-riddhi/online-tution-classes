import { Component } from '@angular/core';
import { StudentHeader } from "../student-header/student-header";
import { StudFooter } from "../stud-footer/stud-footer";

@Component({
  selector: 'app-stud-home',
  imports: [StudentHeader, StudFooter],
  templateUrl: './stud-home.html',
  styleUrl: './stud-home.css',
})
export class StudHome {

}

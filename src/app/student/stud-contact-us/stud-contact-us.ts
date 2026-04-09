import { Component } from '@angular/core';
import { StudentHeader } from "../student-header/student-header";
import { StudFooter } from "../stud-footer/stud-footer";

@Component({
  selector: 'app-stud-contact-us',
  imports: [StudentHeader, StudFooter],
  templateUrl: './stud-contact-us.html',
  styleUrl: './stud-contact-us.css',
})
export class StudContactUs {

}

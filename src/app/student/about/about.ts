import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudentHeader } from "../student-header/student-header";

@Component({
  selector: 'app-about',
  imports: [StudentHeader],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {

}

import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-student-header',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './student-header.html',
  styleUrl: './student-header.css',
})
export class StudentHeader {

}

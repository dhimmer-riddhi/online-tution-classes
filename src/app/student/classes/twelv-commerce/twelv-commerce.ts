import { Component } from '@angular/core';
import { StudFooter } from "../../stud-footer/stud-footer";
import { StudentHeader } from "../../student-header/student-header";

@Component({
  selector: 'app-twelv-commerce',
  imports: [StudFooter, StudentHeader],
  templateUrl: './twelv-commerce.html',
  styleUrl: './twelv-commerce.css',
})
export class TwelvCommerce {

}

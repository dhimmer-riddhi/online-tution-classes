import { Component } from '@angular/core';
import { StudentHeader } from "../student-header/student-header";
import { StudFooter } from "../stud-footer/stud-footer";

@Component({
  selector: 'app-stud-standard',
  imports: [StudentHeader, StudFooter],
  templateUrl: './stud-standard.html',
  styleUrl: './stud-standard.css',
})
export class StudStandard {
  slides = [
    'images/home-cake3.avif',
    'images/home-cake2.jpg',
    'images/home-cake.jpg',
    'images/home-cake4.avif'
  ];

  currentIndex = 0;

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

}

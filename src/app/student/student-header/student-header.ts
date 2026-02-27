import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-header',
  imports: [RouterLink],
  templateUrl: './student-header.html',
  styleUrl: './student-header.css',
})
export class StudentHeader {
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }
}


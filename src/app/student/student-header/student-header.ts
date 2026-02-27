<<<<<<< HEAD
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
=======
import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
>>>>>>> 1e7b33151efec384c301036aed8dce1c5bd6c1ab

@Component({
  selector: 'app-student-header',
  imports: [RouterLink, RouterOutlet],
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


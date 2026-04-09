import { Component, HostListener } from '@angular/core';
import { StudentHeader } from "../student-header/student-header";
import { StudFooter } from "../stud-footer/stud-footer";
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stud-home',
  imports: [StudentHeader, StudFooter,RouterLink,CommonModule,FormsModule],
  templateUrl: './stud-home.html',
  styleUrl: './stud-home.css',
})
export class StudHome {
  searchText: string = '';
filteredItems: any[] = [];
constructor(private router: Router) {}

goToPage(route: string) {
  this.router.navigate([route]);
}
onSearch() {
  if (!this.searchText || this.searchText.trim() === '') {
    this.filteredItems = [];   // 👈 aa line important che
    return;
  }

  this.filteredItems = this.searchItems.filter(item =>
    item.name.toLowerCase().includes(this.searchText.toLowerCase())
  );
}
onButtonClick() {
  if (!this.searchText || this.searchText.trim() === '') {
    this.filteredItems = [];  // kai show nai thay
    return;
  }

  this.onSearch();
}
searchItems = [

  { name: '10th Class', route: '/class-10' },
  { name: '11th Commerce', route: '/class-11-commerce' },
  { name: '11th Science PCM', route: '/class-11-pcm' },
  { name: '11th Science PCB', route: '/class-11-pcb' },
  { name: '12th Commerce', route: '/class-12-commerce' },
  { name: '12th Science PCM', route: '/class-12-pcm' },
  { name: '12th Science PCB', route: '/class-12-pcb' }
];

@HostListener('document:click', ['$event'])
clickOutside(event: any) {
  if (!event.target.closest('.search-box')) {
    this.filteredItems = [];
  }
}
}

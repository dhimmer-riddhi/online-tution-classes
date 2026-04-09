import { Component } from '@angular/core';

@Component({
  selector: 'app-top-nav',
  imports: [],
  templateUrl: './top-nav.html',
  styleUrl: './top-nav.css',
})
export class TopNav {
currentDay: string = '';
currentDate: string = '';
currentTime: string = '';

ngOnInit() {
  this.updateDateTime();
  setInterval(() => {
    this.updateDateTime();
  }, 1000);
}

updateDateTime() {
  const now = new Date();

  this.currentDay = now.toLocaleString('en-IN', { weekday: 'long' });

  this.currentDate = now.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  this.currentTime = now.toLocaleString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}
}

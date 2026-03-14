import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-standard',
  imports: [CommonModule],
  templateUrl: './standard.html',
  styleUrl: './standard.css',
})
export class Standard {
 student:any;

  ngOnInit(){

    const data = localStorage.getItem("student");

    if(data){
      this.student = JSON.parse(data);
    }

  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
student:any;

ngOnInit(){

const data = localStorage.getItem("student");

if(data){
this.student = JSON.parse(data);
}

}
}

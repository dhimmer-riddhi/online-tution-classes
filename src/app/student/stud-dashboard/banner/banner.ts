import { Component } from '@angular/core';

@Component({
  selector: 'app-banner',
  imports: [],
  templateUrl: './banner.html',
  styleUrl: './banner.css',
})
export class Banner {
student:any;

ngOnInit(){

const data = localStorage.getItem("student");

if(data){
this.student = JSON.parse(data);
}

}
}

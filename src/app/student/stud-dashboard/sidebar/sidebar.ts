import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
    constructor(private router: Router) {}

  logout(){

    const confirmLogout = confirm("Are you sure you want to logout?");

    if(confirmLogout){

      // remove student session
      localStorage.removeItem("student");

      // redirect login page
      this.router.navigate(['/student/stud-sign-in']);

    }

  }
}

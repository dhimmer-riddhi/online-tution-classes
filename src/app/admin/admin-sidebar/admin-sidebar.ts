import { Component } from '@angular/core';
import { Router, RouterModule } from "@angular/router";

@Component({
  selector: 'app-admin-sidebar',
  imports: [RouterModule],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
export class AdminSidebar {

  constructor(private router: Router) {}

  onLogout() {
    // 1. Agar aapne Token ya User data save kiya hai to use clear karein
    localStorage.removeItem('token'); 
    sessionStorage.clear();

    // 2. Login page par redirect karein
    // Maan lijiye aapka login route '/login' hai
    this.router.navigate(['admin/admin-login']);
    
    console.log("User Logged Out");
  }
}

import { Component } from '@angular/core';
import { StudentHeader } from "../student-header/student-header";
import { Profile } from "./profile/profile";
import { Sidebar } from "./sidebar/sidebar";
import { RouterOutlet } from "@angular/router";
import { Banner } from "./banner/banner";
import { StudFooter } from "../stud-footer/stud-footer";

@Component({
  selector: 'app-stud-dashboard',
  imports: [Sidebar, RouterOutlet, StudentHeader, Banner, StudFooter],
  templateUrl: './stud-dashboard.html',
  styleUrl: './stud-dashboard.css',
})
export class StudDashboard {

}

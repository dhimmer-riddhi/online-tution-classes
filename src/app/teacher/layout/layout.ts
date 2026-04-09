import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { TopNav } from "../top-nav/top-nav";
import { Sidebar } from "../sidebar/sidebar";


@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, TopNav, Sidebar],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

}

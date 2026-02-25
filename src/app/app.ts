import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {  StudentHeader } from "./student/student-header/student-header";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StudentHeader],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('online-tution-classes');
}

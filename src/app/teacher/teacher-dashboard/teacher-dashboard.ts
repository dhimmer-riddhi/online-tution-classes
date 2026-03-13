import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { TeacherHeader } from '../teacher-header/teacher-header';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';

declare var bootstrap: any;

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, TeacherHeader],
  templateUrl: './teacher-dashboard.html',
  styleUrls: ['./teacher-dashboard.css']
})
export class TeacherDashboard implements OnInit {
  @ViewChild('saveToast') saveToast!: ElementRef;

  toastMessage = '';
  teacherName = "Teacher"; // Default name

  // Dynamic Dashboard Stats
  totalStudents = 0;
  totalClasses = 0;
  totalSubjects = 0;
  totalAssignments = 0;
  totalVideos = 0;

  // Chart Instances
  private assignmentChartInstance: any;
  private videoChartInstance: any;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    // Teacher ka naam session storage se nikalna (Login page se set kiya gaya name)
    const name = sessionStorage.getItem("teacherName");
    if (name && name !== 'undefined') {
      this.teacherName = name; 
    }

    this.loadDashboardData();
  }

  loadDashboardData() {
    // 1. Total Students Count (StudentRegistrations collection)
    this.firebaseService.getCollection(FirebaseCollections.StudentRegistrations).subscribe(data => {
      this.totalStudents = data.length;
    });

    // 2. Assignments Count & Bar Chart (TeacherAssignment collection)
    this.firebaseService.getCollection(FirebaseCollections.TeacherAssignment).subscribe(data => {
      this.totalAssignments = data.length;
      this.createAssignmentChart(data);
    });

    // 3. Videos & Subjects Data (ClassContent collection)
    this.firebaseService.getCollection(FirebaseCollections.ClassContent).subscribe((data: any[]) => {
      this.totalVideos = data.length;
      
      // Calculate Unique Subjects
      const uniqueSubjects = [...new Set(data.map(item => item.subject))];
      this.totalSubjects = uniqueSubjects.length;

      // Calculate Unique Classes (Standards)
      const uniqueClasses = [...new Set(data.map(item => item.standard))];
      this.totalClasses = uniqueClasses.length;

      this.createVideoChart(data);
    });
  }

  showToast(message: string) {
    this.toastMessage = message;
    const toast = new bootstrap.Toast(this.saveToast.nativeElement, {
      delay: 3000
    });
    toast.show();
  }

  /* DYNAMIC ASSIGNMENT CHART */
  createAssignmentChart(data: any[]) {
    const grouping: any = {};
    data.forEach(item => {
      const label = item.standard || 'General';
      grouping[label] = (grouping[label] || 0) + 1;
    });

    if (this.assignmentChartInstance) this.assignmentChartInstance.destroy();

    this.assignmentChartInstance = new Chart("assignmentChart", {
      type: 'bar',
      data: {
        labels: Object.keys(grouping),
        datasets: [{
          label: 'Assignments',
          data: Object.values(grouping),
          backgroundColor: ['#1abc9c', '#3498db', '#9b59b6', '#f39c12']
        }]
      },
      options: { responsive: true }
    });
  }

  /* DYNAMIC VIDEO CHART */
  createVideoChart(data: any[]) {
    const grouping: any = {};
    data.forEach(item => {
      const label = item.subject || 'Unknown';
      grouping[label] = (grouping[label] || 0) + 1;
    });

    if (this.videoChartInstance) this.videoChartInstance.destroy();

    this.videoChartInstance = new Chart("videoChart", {
      type: 'doughnut',
      data: {
        labels: Object.keys(grouping),
        datasets: [{
          data: Object.values(grouping),
          backgroundColor: ['#1abc9c', '#3498db', '#e74c3c', '#9b59b6']
        }]
      }
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-dashboard.html',
  styleUrls: ['./teacher-dashboard.css']
})
export class TeacherDashboard implements OnInit {

  teacherName = "Teacher";

  /* STATIC DATA */

  totalStudents = 120;
  totalClasses = 8;
  totalSubjects = 5;
  totalAssignments = 20;
  totalVideos = 15;

  ngOnInit() {

    const name = sessionStorage.getItem("teacherName");
    if (name) {
      this.teacherName = name;
    }

    setTimeout(() => {
      this.createAssignmentChart();
      this.createVideoChart();
    }, 200);

  }

  /* ASSIGNMENT CHART */

  createAssignmentChart() {

    new Chart("assignmentChart", {

      type: 'bar',

      data: {
        labels: ['Class 9', 'Class 10', 'Class 11', 'Class 12'],

        datasets: [{
          label: 'Assignments',

          data: [5, 7, 4, 6],

          backgroundColor: [
            '#1abc9c',
            '#3498db',
            '#9b59b6',
            '#f39c12'
          ]
        }]
      },

      options: {
        responsive: true
      }

    });

  }

  /* VIDEO CHART */

  createVideoChart() {

    new Chart("videoChart", {

      type: 'doughnut',

      data: {
        labels: ['Maths', 'Science', 'Accounts', 'Physics'],

        datasets: [{

          data: [10, 6, 4, 7],

          backgroundColor: [
            '#1abc9c',
            '#3498db',
            '#e74c3c',
            '#9b59b6'
          ]

        }]
      }

    });

  }

}

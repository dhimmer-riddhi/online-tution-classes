import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { AdminSidebar } from "../admin-sidebar/admin-sidebar";
import { Application } from '../../interface/application';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminSidebar],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {
  today = new Date();

  totalStudents$!: Observable<number>;
  totalTeachers$!: Observable<number>;
  pendingAdmissions$!: Observable<number>;

  barChart: any;
  pieChart: any;

  constructor(private firebaseService: FirebaseService) {
    this.totalStudents$ = this.firebaseService
      .getCollection<Application>(FirebaseCollections.Applications)
      .pipe(map(apps => apps.length));

    this.totalTeachers$ = this.firebaseService
      .getCollection<any>(FirebaseCollections.Teachers)
      .pipe(map(t => t.length));

    this.pendingAdmissions$ = this.firebaseService
      .getCollection<any>(FirebaseCollections.StudentRegistrations)
      .pipe(map(r => r.filter(s => s.status === 'pending').length));
  }

  ngOnInit() {
    this.loadCharts();
  }

  loadCharts() {
    this.firebaseService.getCollection<Application>(FirebaseCollections.Applications)
      .subscribe(students => {
        const studentCount = students.length;

        this.firebaseService.getCollection<any>(FirebaseCollections.Teachers)
          .subscribe(teachers => {
            const teacherCount = teachers.length;

            this.firebaseService.getCollection<any>(FirebaseCollections.StudentRegistrations)
              .subscribe(regs => {
                const pendingCount = regs.filter(r => r.status === 'pending').length;

                // Destroy previous charts if exist
                if (this.barChart) this.barChart.destroy();
                if (this.pieChart) this.pieChart.destroy();

                // Bar Chart
                const barCtx: any = document.getElementById('barChart');
                if (barCtx) {
                  this.barChart = new Chart(barCtx, {
                    type: 'bar',
                    data: {
                      labels: ['Students', 'Teachers', 'Pending'],
                      datasets: [{
                        label: 'Count',
                        data: [studentCount, teacherCount, pendingCount],
                        backgroundColor: ['#1e88e5', '#28c76f', '#ff9f43']
                      }]
                    },
                    options: {
                      responsive: true,
                      plugins: { legend: { display: false }, title: { display: true, text: 'Bar Chart Overview' } },
                      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
                    }
                  });
                }

                // Pie Chart
                const pieCtx: any = document.getElementById('pieChart');
                if (pieCtx) {
                  this.pieChart = new Chart(pieCtx, {
                    type: 'pie',
                    data: {
                      labels: ['Students', 'Teachers'],
                      datasets: [{
                        data: [studentCount, teacherCount],
                        backgroundColor: ['#1e88e5', '#28c76f']
                      }]
                    },
                    options: {
                      responsive: true,
                      plugins: { title: { display: true, text: 'Students vs Teachers' } }
                    }
                  });
                }

              });
          });
      });
  }
  options: {
    responsive: true;
    plugins: {
      legend: {
        labels: {
          color: '#333'; // 🔥 dark text
          font: {
            size: 14;
          };
        };
      };
    };
    scales: {
      x: {
        ticks: { color: '#333'; };
      };
      y: {
        ticks: { color: '#333'; };
      };
    };
  } | undefined
}
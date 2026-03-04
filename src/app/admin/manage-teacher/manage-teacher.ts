import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { Teacher } from '../../interface/teacher';
import { CommonModule } from '@angular/common';
import { AdminSidebar } from "../admin-sidebar/admin-sidebar";
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-manage-teacher',
  standalone: true,
  imports: [CommonModule, AdminSidebar],
  templateUrl: './manage-teacher.html',
  styleUrl: './manage-teacher.css',
})
export class ManageTeacher implements OnInit {

  pendingTeachers: Teacher[] = [];
  processedTeachers: Teacher[] = [];   // ✅ NEW ARRAY
  loading = false;

  constructor(
    private firebaseService: FirebaseService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadTeachers();
  }

  loadTeachers() {
    this.loading = true;

    this.firebaseService
      .getCollection<Teacher>(FirebaseCollections.Teachers)
      .subscribe({
        next: (data) => {

          // ✅ Pending Teachers
          this.pendingTeachers = data.filter(t => t.status === 'pending');

          // ✅ Approved + Rejected Teachers
          this.processedTeachers = data.filter(
            t => t.status === 'approved' || t.status === 'rejected'
          );

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Firestore Error:", err);
          this.loading = false;
        }
      });
  }

  generatePassword(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // ===============================
  // ✅ APPROVE TEACHER
  // ===============================
  async approveTeacher(teacher: Teacher) {

    if (!teacher.id) return;
    if (!confirm(`Approve ${teacher.teacherName}?`)) return;

    const autoPassword = this.generatePassword();

    try {

      await this.firebaseService.updateDocument(
        FirebaseCollections.Teachers,
        teacher.id,
        {
          status: 'approved',
          password: autoPassword
        }
      );

      await firstValueFrom(
        this.http.post(
          'http://localhost:3000/send-teacher-approval',
          {
            to: teacher.email,
            name: teacher.teacherName,
            password: autoPassword
          }
        )
      );

      alert(`✅ ${teacher.teacherName} Approved`);
      this.loadTeachers();

    } catch (error) {
      console.error("Approve Error:", error);
      alert("❌ Error While Approving");
    }
  }

  // ===============================
  // ❌ REJECT TEACHER
  // ===============================
  async rejectTeacher(teacher: Teacher) {

    if (!teacher.id) return;
    if (!confirm(`Reject ${teacher.teacherName}?`)) return;

    try {

      await this.firebaseService.updateDocument(
        FirebaseCollections.Teachers,
        teacher.id,
        { status: 'rejected' }
      );

      await firstValueFrom(
        this.http.post(
          'http://localhost:3000/send-teacher-rejection',
          {
            to: teacher.email,
            name: teacher.teacherName
          }
        )
      );

      alert(`❌ ${teacher.teacherName} Rejected`);
      this.loadTeachers();

    } catch (error) {
      console.error("Reject Error:", error);
      alert("❌ Error While Rejecting");
    }
  }
}
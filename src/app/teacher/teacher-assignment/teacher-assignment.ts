import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { Assignment } from '../../interface/teacher-assignment';

@Component({
  selector: 'app-teacher-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-assignment.html',
  styleUrls: ['./teacher-assignment.css']
})
export class TeacherAssignment implements OnInit, OnDestroy {

  selectedStandard: string | null = null;
  selectedCategory: string | null = null;
  selectedSubject: any = null;

  standards = ['9', '10', '11', '12'];
  categories: string[] = [];

  subjects: any[] = [];
  chapters: any[] = [];

  timer: any;

  constructor(
    private firebaseService: FirebaseService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.startCountdownTimer();
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  // ================= CATEGORY =================
  selectStandard(std: string): void {
    this.selectedStandard = std;
    this.selectedSubject = null;
    this.selectedCategory = null;
    this.chapters = [];

    if (std === '9') {
      this.categories = [];
    } else if (std === '10') {
      this.categories = ['GSEB', 'CBSE'];
    } else if (std === '11' || std === '12') {
      this.categories = ['Commerce', 'PCM', 'PCB'];
    }

    this.loadSubjects();
  }

  selectCategory(cat: string): void {
    this.selectedCategory = cat;
    this.selectedSubject = null;
    this.chapters = [];
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.firebaseService
      .getCollection(FirebaseCollections.Standard)
      .subscribe((data: any[]) => {

        this.subjects = data.filter(d => {

          if (this.selectedStandard === '9') {
            return d.standard === this.selectedStandard;
          }

          return (
            d.standard === this.selectedStandard &&
            d.category === this.selectedCategory
          );
        });

      });
  }

  openSubject(subject: any): void {
    this.selectedSubject = subject;

    this.firebaseService
      .getDocument<Assignment>(
        FirebaseCollections.TeacherAssignment,
        subject.id
      )
      .subscribe(doc => {

        this.ngZone.run(() => {

          this.chapters = doc?.chapters || [];

          // ensure flags exist
          this.chapters.forEach((ch: any) => {
            ch.editing = false;

            if (!ch.assignments) ch.assignments = [];

            ch.assignments.forEach((a: any) => {
              a.editing = false;
              a.expired = false;
            });
          });

          this.updateCountdown();
        });

      });
  }

  back(): void {
    this.selectedSubject = null;
    this.chapters = [];
  }

  // ================= EDIT FUNCTIONS =================
  toggleChapterEdit(chapter: any): void {
    chapter.editing = !chapter.editing;
  }

  toggleAssignmentEdit(assign: any): void {
    assign.editing = !assign.editing;
  }

  // ================= COUNTDOWN =================
  startCountdownTimer(): void {
    this.timer = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  updateCountdown(): void {

    const now = new Date().getTime();

    this.chapters.forEach((ch: any) => {

      ch.assignments?.forEach((a: any) => {

        if (!a.dueDate) return;

        const due = new Date(a.dueDate).getTime();
        const distance = due - now;

        if (distance <= 0) {
          a.expired = true;
          a.countdown = 'Expired';
        } else {

          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((distance / 1000 / 60) % 60);
          const seconds = Math.floor((distance / 1000) % 60);

          a.countdown = `${days}d ${hours}h ${minutes}m ${seconds}s`;
          a.expired = false;
        }

      });

    });
  }

  // ================= CHAPTER =================
  addChapter(): void {
    this.chapters.push({
      chapterNo: this.chapters.length + 1,
      chapterName: '',
      editing: true,
      assignments: []
    });
  }

  deleteChapter(index: number): void {
    this.chapters.splice(index, 1);
    this.chapters.forEach((ch: any, i: number) => ch.chapterNo = i + 1);
  }

  // ================= ASSIGNMENT =================
  addAssignment(chapter: any): void {
    chapter.assignments.push({
      title: '',
      dueDate: '',
      editing: true,
      expired: false,
      files: []
    });
  }

  deleteAssignment(chapter: any, index: number): void {
    chapter.assignments.splice(index, 1);
  }

  async onFileUpload(event: any, assignment: any): Promise<void> {

    const file = event.target.files[0];
    if (!file) return;

    const path = `assignments/${Date.now()}_${file.name}`;
    const result = await this.firebaseService.uploadFile(path, file);

    assignment.files.push({
      fileName: file.name,
      fileUrl: result.downloadURL,
      fileSize: file.size
    });

    alert('File Uploaded Successfully');
  }

  deleteFile(assignment: any, index: number): void {
    assignment.files.splice(index, 1);
  }

  // ================= SAVE =================
  async saveAssignment(): Promise<void> {

    if (!this.selectedStandard || !this.selectedSubject) return;

    const data: Assignment = {
      standard: this.selectedStandard,
      category: this.selectedCategory || '',
      subjectId: this.selectedSubject.id,
      subjectName: this.selectedSubject.subject,
      chapters: this.chapters
    };

    await this.firebaseService.updateDocument(
      FirebaseCollections.TeacherAssignment,
      this.selectedSubject.id,
      data
    );

    alert('Assignment Saved Successfully');
  }
}
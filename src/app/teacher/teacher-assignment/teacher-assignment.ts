import { Component, OnInit, NgZone, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { Assignment } from '../../interface/teacher-assignment';
declare var bootstrap: any;
@Component({
  selector: 'app-teacher-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-assignment.html',
  styleUrls: ['./teacher-assignment.css']
})
export class TeacherAssignment implements OnInit, OnDestroy {

  @ViewChild('saveToast') saveToast!: ElementRef;

  toastMessage = '';
  
  

  selectedStandard: string | null = null;
  selectedCategory: string | null = null;
  selectedSubject: any = null;

  standards = ['9', '10', '11', '12'];
  categories: string[] = [];
  subjects: any[] = [];
  chapters: any[] = [];

  activeChapter: number | null = null;   // Track which chapter tab is open
  timer: any;

  constructor(
    private firebaseService: FirebaseService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.startCountdownTimer();
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  // ================= CATEGORY =================
  selectStandard(std: string): void {
    this.selectedStandard = std;
    this.selectedSubject = null;
    this.selectedCategory = null;
    this.chapters = [];
    this.activeChapter = null;

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
    this.activeChapter = null;
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

          this.chapters.forEach((ch: any) => {
            ch.editing = false;
            if (!ch.assignments) ch.assignments = [];

            ch.assignments.forEach((a: any) => {
              a.editing = false;
              a.expired = false;
            });
          });

          this.activeChapter = this.chapters.length > 0 ? 0 : null;
          this.updateCountdown();
        });
      });
  }

  back(): void {
    this.selectedSubject = null;
    this.chapters = [];
    this.activeChapter = null;
  }

  // ================= EDIT FUNCTIONS =================
  showToast(message: string) {
    this.toastMessage = message;
    const toast = new bootstrap.Toast(this.saveToast.nativeElement, {
      delay: 3000
    });
    toast.show();
  }
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
    const newChapter = {
      chapterNo: this.chapters.length + 1,
      chapterName: '',
      editing: false,
      assignments: [],
      content: '',
      assignmentTitle: '',
      assignmentDate: '',
      files: []
    };
    this.chapters.push(newChapter);
    this.activeChapter = this.chapters.length - 1; // auto-open new chapter
  }

  deleteChapter(index: number): void {
    this.chapters.splice(index, 1);
    this.chapters.forEach((ch: any, i: number) => ch.chapterNo = i + 1);

    if (this.activeChapter === index) {
      this.activeChapter = null;
    } else if (this.activeChapter !== null && this.activeChapter > index) {
      this.activeChapter--; // shift active index if later chapter removed
    }
  }

  openChapter(index: number): void {
    this.activeChapter = index;
    this.chapters[index].editing = true;
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

  async onFileUpload(event: any, target: any): Promise<void> {
    const file = event.target.files[0];
    if (!file) return;

    const path = `assignments/${Date.now()}_${file.name}`;
    const result = await this.firebaseService.uploadFile(path, file);

    target.files = target.files || [];
    target.files.push({
      fileName: file.name,
      fileUrl: result.downloadURL,
      fileSize: file.size
    });

    this.showToast('File Uploaded Successfully');
  }

  deleteFile(target: any, index: number): void {
    target.files.splice(index, 1);
  }

  // ================= RICH TEXT TOOLBAR =================
  applyFormat(chapter: any, tag: string): void {
    const textarea: any = document.getElementById(`chapter-${chapter.chapterNo}`);
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    let formatted = value;

    switch (tag) {
      case 'b':
        formatted = value.slice(0, start) + '<b>' + value.slice(start, end) + '</b>' + value.slice(end);
        break;
      case 'i':
        formatted = value.slice(0, start) + '<i>' + value.slice(start, end) + '</i>' + value.slice(end);
        break;
      case 'link':
        const url = prompt('Enter URL');
        if (url) {
          formatted = value.slice(0, start) + `<a href="${url}">` + value.slice(start, end) + '</a>' + value.slice(end);
        }
        break;
      case 'img':
        const imgUrl = prompt('Enter image URL');
        if (imgUrl) {
          formatted = value.slice(0, start) + `<img src="${imgUrl}" alt="Image">` + value.slice(end);
        }
        break;
      case 'table':
        formatted = value.slice(0, start) + `<table><tr><td>Cell</td></tr></table>` + value.slice(end);
        break;
      case 'quote':
        formatted = value.slice(0, start) + `<blockquote>` + value.slice(start, end) + '</blockquote>' + value.slice(end);
        break;
      case 'video':
        const videoUrl = prompt('Enter video URL');
        if (videoUrl) {
          formatted = value.slice(0, start) + `<iframe src="${videoUrl}" frameborder="0"></iframe>` + value.slice(end);
        }
        break;
      case 'ul':
        formatted = value.slice(0, start) + `<ul><li>` + value.slice(start, end) + '</li></ul>' + value.slice(end);
        break;
      case 'ol':
        formatted = value.slice(0, start) + `<ol><li>` + value.slice(start, end) + '</li></ol>' + value.slice(end);
        break;
      case 'undo':
        
        this.showToast('Undo not implemented yet.');
        return;
    }

    chapter.content = formatted;
    textarea.value = formatted;
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

    
    this.showToast('Assignment Saved Successfully');
    
  }
}
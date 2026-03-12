import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { Quiz } from '../../interface/quiz';
import { ClassContent } from '../../interface/class-content';
declare var bootstrap: any;


@Component({
  selector: 'app-teacher-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-quiz.html',
  styleUrls: ['./teacher-quiz.css']
})
export class TeacherQuiz implements OnInit {
  selectedStandard: string | null = null;
  selectedCategory: string | null = null;
  selectedSubject: any = null;
  selectedChapterIndex: number = 0;

  standards = ['9', '10', '11', '12'];
  categories: string[] = [];
  subjects: any[] = [];

  @ViewChild('saveToast') saveToast!: ElementRef;

  toastMessage = '';
  
  
  // Single Quiz Object initialized using resetQuiz
  activeQuiz: Quiz = {
    quizName: '',
    standard: '',
    subjectId: '',
    subjectName: '',
    chapters: [],
    totalQuizMarks: 0,
    updatedAt: new Date()
  };

  constructor(private firebaseService: FirebaseService, private ngZone: NgZone) {}

  ngOnInit() {}

  // Standard select hone par subjects load karna
  selectStandard(std: string) {
    this.selectedStandard = std;
    this.selectedCategory = null;
    this.selectedSubject = null;
    this.categories = std === '10' ? ['GSEB', 'CBSE'] : (['11', '12'].includes(std) ? ['Commerce', 'PCM', 'PCB'] : []);
    this.loadSubjects();
  }

  loadSubjects() {
    this.firebaseService.getCollection(FirebaseCollections.Standard).subscribe((data: any[]) => {
      this.subjects = data.filter(d => 
        d.standard === this.selectedStandard && 
        (!this.selectedCategory || d.category === this.selectedCategory)
      );
    });
  }

  // Jab subject par click karein toh content sync karein
  openSubjectQuiz(subject: any) {
    this.selectedSubject = subject;
    
    // Step 1: Class Content se chapters lein
    this.firebaseService.getDocument<ClassContent>(FirebaseCollections.ClassContent, subject.id).subscribe(contentDoc => {
      const contentChapters = contentDoc?.contents || [];

      // Step 2: Existing Quiz lein (Enum ki jagah 'Quizzes' string use ki hai for safety)
      this.firebaseService.getDocument<Quiz>(FirebaseCollections.Quizzes, subject.id).subscribe(quizDoc => {
        this.ngZone.run(() => {
          if (quizDoc) {
            this.activeQuiz = quizDoc;
          } else {
            this.activeQuiz = this.resetQuiz(subject);
          }
          this.syncChapters(contentChapters);
        });
      });
    });
  }
  showToast(message: string) {
    this.toastMessage = message;
    const toast = new bootstrap.Toast(this.saveToast.nativeElement, {
      delay: 3000
    });
    toast.show();
  }

  // Chapters ko Class Content ke saath align karna
  syncChapters(contentChapters: any[]) {
    const syncedChapters = contentChapters.map(cCh => {
      const existingQuizCh = this.activeQuiz.chapters?.find(q => q.chapterNo === cCh.chapterNo);
      return {
        chapterNo: cCh.chapterNo,
        chapterName: cCh.chapterName,
        totalMarks: existingQuizCh?.totalMarks || 0,
        questions: existingQuizCh?.questions || []
      };
    });
    this.activeQuiz.chapters = syncedChapters;
    this.calculateGrandTotal();
  }

  addQuestion(chapter: any) {
    if (!chapter.questions) chapter.questions = [];
    chapter.questions.push({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      marks: 1
    });
    this.calculateChapterTotal(chapter);
  }

  removeQuestion(chapter: any, qIndex: number) {
    chapter.questions.splice(qIndex, 1);
    this.calculateChapterTotal(chapter);
  }

  calculateChapterTotal(chapter: any) {
    chapter.totalMarks = chapter.questions.reduce((sum: number, q: any) => sum + (q.marks || 0), 0);
    this.calculateGrandTotal();
  }

  calculateGrandTotal() {
    this.activeQuiz.totalQuizMarks = this.activeQuiz.chapters.reduce((sum, ch) => sum + (ch.totalMarks || 0), 0);
  }

  // Error Fixed: Data ko plain object mein convert kiya aur 'as any' use kiya
  async saveQuiz() {
    if (!this.selectedSubject) return;

    this.activeQuiz.updatedAt = new Date();
    
    // Pure object ko clean kar rahe hain taaki Firebase error na de
    const dataToSave = JSON.parse(JSON.stringify(this.activeQuiz));

    try {
      await this.firebaseService.updateDocument(FirebaseCollections.Quizzes, this.selectedSubject.id, dataToSave as any);
      alert("Quiz saved successfully!");
    } catch (error) {
      console.log("Saving new document...");
      await this.firebaseService.addDocument(FirebaseCollections.Quizzes, { ...dataToSave, id: this.selectedSubject.id } as any);
      alert("Quiz created and saved!");
    }
  }

  // Error Fixed: resetQuiz function define kiya gaya
  resetQuiz(subject?: any): Quiz {
    return {
      quizName: '',
      standard: this.selectedStandard || '',
      subjectId: subject?.id || '',
      subjectName: subject?.subject || '',
      chapters: [],
      totalQuizMarks: 0,
      updatedAt: new Date()
    };
  }

  backToSubjects() { 
    this.selectedSubject = null; 
  }
}
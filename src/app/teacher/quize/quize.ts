import { Component, NgZone, OnInit } from '@angular/core';
// import { Quiz, QuizQuestion } from '../../interface/quiz';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { Teacher } from '../../interface/teacher';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Question, Quiz } from '../../interface/quiz';
import { ClassContent } from '../../interface/class-content';
 declare const bootstrap: any;
@Component({
  selector: 'app-quize',
  imports: [CommonModule, FormsModule],
  templateUrl: './quize.html',
  styleUrl: './quize.css',
})
export class Quize implements OnInit {
  
  standards: string[] = [];
  subjects: string[] = [];
  allQuizzes: any[] = [];
  editingId: string = '';
 
  selectedStandard: string = '';
  selectedSubject: string = '';
  quiz: Quiz = {
    standard: '',
    subject: '',
    videoSet: 1,
    questions: []
  };

  newQuestion: Question = {
    question: '',
    options: ['', '', '', ''],
    correct: ''
  };

  editingQuestionIndex: number | null = null;

  // 🔹 Modal visibility flag
  showQuestionModal: boolean = false;

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.loadQuizzes();

    this.firebaseService
      .getCollection(FirebaseCollections.Courses)
      .subscribe((data: any) => {
        const stdSet = new Set<string>();
        data.forEach((course: any) => stdSet.add(course.class));
        this.standards = Array.from(stdSet);
      });
  }

  getSubjectsByStandard() {
    this.firebaseService
      .getCollection(FirebaseCollections.Courses)
      .subscribe((data: any) => {
        this.subjects = data
          .filter((course: any) => course.class === this.selectedStandard)
          .map((course: any) => course.title);
      });
  }

  // 🔹 Open modal to add/edit question
  // openQuestionModal(q?: Question, index?: number) {
  //   if (q && index !== undefined) {
  //     // Edit existing question
  //     this.newQuestion = { ...q, options: [...q.options] };
  //     this.editingQuestionIndex = index;
  //   } else {
  //     // Add new question
  //     this.newQuestion = { question: '', options: ['', '', '', ''], correct: '' };
  //     this.editingQuestionIndex = null;
  //   }

  //   this.showQuestionModal = true;
  // }

  // 🔹 Close modal
  closeModal(event?: any) {
    this.showQuestionModal = false;
  }

  // ➕ Add or Update Question
  addQuestion() {
    if (!this.newQuestion.question || this.newQuestion.options.some(opt => !opt) || !this.newQuestion.correct) {
      alert("Please fill all fields");
      return;
    }

    if (this.editingQuestionIndex !== null) {
      // Update existing question
      this.quiz.questions[this.editingQuestionIndex] = { ...this.newQuestion };
      this.editingQuestionIndex = null;
    } else {
      // Add new question
      this.quiz.questions.push({ ...this.newQuestion });
    }

    // Reset form
    this.newQuestion = { question: '', options: ['', '', '', ''], correct: '' };
    this.showQuestionModal = false; // close modal
  }

  removeQuestion(index: number) {
    this.quiz.questions.splice(index, 1);
  }

  saveQuiz() {
    this.quiz.standard = this.selectedStandard;
    this.quiz.subject = this.selectedSubject;

    if (!this.quiz.standard || !this.quiz.subject) {
      alert("Select Standard & Subject");
      return;
    }

    if (this.quiz.questions.length < 2) {
      alert("Add at least 2 questions");
      return;
    }

    if (this.editingId) {
      this.firebaseService.updateDocument(FirebaseCollections.Quizzes, this.editingId, this.quiz as any)
        .then(() => {
          alert("Quiz Updated");
          this.resetForm();
        });
    } else {
      this.firebaseService.addData(FirebaseCollections.Quizzes, this.quiz)
        .then(() => {
          alert("Quiz Saved");
          this.resetForm();
        });
    }
  }

  loadQuizzes() {
    this.firebaseService
      .getCollection(FirebaseCollections.Quizzes)
      .subscribe((data: any) => this.allQuizzes = data);
  }

  editQuiz(q: any) {
    this.quiz = {
      standard: q.standard,
      subject: q.subject,
      videoSet: q.videoSet,
      questions: JSON.parse(JSON.stringify(q.questions)) // deep copy
    };
    this.selectedStandard = q.standard;
    this.selectedSubject = q.subject;
    this.editingId = q.id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteQuiz(id: string) {
    if (confirm("Are you sure to delete?")) {
      this.firebaseService.deleteDocument(FirebaseCollections.Quizzes, id)
        .then(() => {
          alert("Deleted Successfully");
          this.loadQuizzes();
        });
    }
  }
openQuestionModal(q?: Question, index?: number) {
  if (q && index !== undefined) {
    // Edit existing question
    this.newQuestion = { ...q, options: [...q.options] };
    this.editingQuestionIndex = index;
  } else {
    // Add new question
    this.newQuestion = { question: '', options: ['', '', '', ''], correct: '' };
    this.editingQuestionIndex = null;
  }

  const modalEl = document.getElementById('questionModal');
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}

hideModal() {
  const modalEl = document.getElementById('questionModal');
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal?.hide();
}
  resetForm() {
    this.quiz = { standard: '', subject: '', videoSet: 1, questions: [] };
    this.selectedStandard = '';
    this.selectedSubject = '';
    this.editingId = '';
    this.loadQuizzes();
  }
  
}

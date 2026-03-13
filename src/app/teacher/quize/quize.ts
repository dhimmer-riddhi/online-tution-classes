import { Component, NgZone, OnInit } from '@angular/core';
// import { Quiz, QuizQuestion } from '../../interface/quiz';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { Teacher } from '../../interface/teacher';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TeacherHeader } from "../teacher-header/teacher-header";
import { Quiz } from '../../interface/quiz';
import { ClassContent } from '../../interface/class-content';

@Component({
  selector: 'app-quize',
  imports: [CommonModule, FormsModule,TeacherHeader],
  templateUrl: './quize.html',
  styleUrl: './quize.css',
})
export class Quize implements OnInit {

  teacherId = '';

  subjects: string[] = [];

  standard = '';

  subject = '';

  questions: any[] = [];

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {

    this.teacherId = localStorage.getItem('teacherId') || '';

    this.loadTeacherSubjects();

    this.initQuestions();

  }

  initQuestions() {

    this.questions = [
      { question: '', options: ['', '', '', ''], answer: '' },
      { question: '', options: ['', '', '', ''], answer: '' },
      { question: '', options: ['', '', '', ''], answer: '' },
      { question: '', options: ['', '', '', ''], answer: '' },
      { question: '', options: ['', '', '', ''], answer: '' }
    ];

  }

  loadTeacherSubjects() {

    this.firebaseService
      .getCollection<any>(FirebaseCollections.Teachers)
      .subscribe(data => {

        const teacher = data.find(t => t.id === this.teacherId);

        if (teacher) {

          if (Array.isArray(teacher.subjects)) {
            this.subjects = teacher.subjects;
          } else {
            this.subjects = [teacher.subjects];
          }

        }

      });

  }

  createQuiz() {

    const quiz = {

      teacherId: this.teacherId,

      standard: this.standard,

      subject: this.subject,

      questions: this.questions,

      createdAt: new Date()

    };

    this.firebaseService.addDocument(
      FirebaseCollections.Quiz,
      quiz
    );

    alert("Quiz Created Successfully");

  }

}

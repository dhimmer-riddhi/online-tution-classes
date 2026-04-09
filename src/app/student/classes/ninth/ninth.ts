import { Component } from '@angular/core';
import { StudFooter } from "../../stud-footer/stud-footer";
import { StudentHeader } from "../../student-header/student-header";
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../../firebase-service/firebase-enum';

@Component({
  selector: 'app-ninth',
  imports: [StudFooter, StudentHeader, CommonModule],
  templateUrl: './ninth.html',
  styleUrl: './ninth.css',
})
export class Ninth {


  cards: any[] = [];
  videos: any[] = [];

  quizUnlocked: boolean = false;
  studentData: any = null
  isLoggedIn = false
  quizData: any = null;
  currentCard = 1;

  showVideo = false;
  selectedVideo: any = null;
  watchedVideos: any = {}; // subject wise tracking
  currentSubject: string = '';

  quizStarted = false;
  quizSubmitted = false;
  userAnswers: any[] = [];
  score = 0;

  attemptCount = 0;
  maxAttempts = 2;

retryQuiz(){
  this.quizSubmitted = false;
  this.showAnswers = false;
  this.userAnswers = [];
}
  showAnswers = false; // result pachi answers show
  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {

    const student = localStorage.getItem('student')

    if (student) {
      this.studentData = JSON.parse(student)
      this.isLoggedIn = true
    }

    this.firebaseService
      .getCollection(FirebaseCollections.Courses)
      .subscribe((data: any) => {

        this.cards = data.filter((course: any) => {

          return course.class === '9th'

        })

      })

  }

  // ==========================
  // CARD SLIDER
  // ==========================

  nextCard() {

    if (this.currentCard < this.cards.length) {
      this.currentCard++;
    }

  }

  prevCard() {

    if (this.currentCard > 1) {
      this.currentCard--;
    }

  }

  // ==========================
  // FETCH VIDEOS
  // ==========================

  getVideosBySubject(subject: string) {
    this.currentSubject = subject;
    this.watchedVideos = {};
    this.quizUnlocked = false;

    this.firebaseService
      .getCollection(FirebaseCollections.ClassContent)
      .subscribe((data: any) => {

        let videos: any[] = [];

        data.forEach((doc: any) => {

          const item = doc.data ? doc.data : doc;

          if (
            item.standard === '9th' &&
            item.subjectName === subject &&
            item.video
          ) {

            const video = item.video;

            videos.push({
              id: doc.id,
              title: video.title,
              desc: video.description,
              duration: video.time,
              date: video.date,
              videoUrl: video.url,
              thumb: video.image
            });

          }

        });

        this.videos = videos;

        setTimeout(() => {
          document.querySelector('.event-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);

      });

  }

  // ==========================
  // VIDEO MODAL
  // ==========================

  openVideo(video: any) {

    this.selectedVideo = video;
    this.showVideo = true;

    // mark video as opened
    if (!this.watchedVideos[this.currentSubject]) {
      this.watchedVideos[this.currentSubject] = {};
    }

    this.watchedVideos[this.currentSubject][video.id] = true;

    this.checkQuizUnlock();

  }

  closeVideo() {

    this.showVideo = false;
    this.selectedVideo = null;

  }

  // Quiz unlock
  checkQuizUnlock() {

    // jo 2 videos open thai gaya hoy
    const subjectVideos = this.watchedVideos[this.currentSubject] || {};
    const watchedCount = Object.keys(subjectVideos).length;

    if (watchedCount >= 2) {
      this.quizUnlocked = true;

      // 🔥 quiz fetch call
      this.getQuiz();
    }

  }
  startQuiz() {
    this.quizStarted = true;
  }
  selectAnswer(index: number, option: string) {
    this.userAnswers[index] = option;
  }
  submitQuiz() {

    const total = this.quizData.questions.length;
    const answered = this.userAnswers.filter(a => a).length;

    // ❌ if not all answered
    if (answered < total) {
      alert("⚠️ Please answer all questions before submitting!");
      return;
    }

    // ❌ attempt limit
    if (this.attemptCount >= this.maxAttempts) {
      alert("❌ You have reached maximum attempts!");
      return;
    }

    this.attemptCount++;

    // score calculate
    let score = 0;

    this.quizData.questions.forEach((q: any, i: number) => {
      if (this.userAnswers[i] === q.correct) {
        score++;
      }
    });

    this.score = score;
    this.quizSubmitted = true;
    this.showAnswers = true;
  }
  getQuiz() {

    this.firebaseService
      .getCollection(FirebaseCollections.Quizzes)
      .subscribe((data: any) => {

        const quiz = data.find((q: any) =>
          q.standard === '9th' &&
          q.subject === this.currentSubject &&
          q.videoSet === 1
        );

        this.quizData = quiz;

        console.log("Quiz Data:", quiz);

      });

  }
  getProgress(): number {
    if (!this.quizData || !this.quizData.questions) return 0;

    const answered = this.userAnswers.filter(a => a).length;
    const total = this.quizData.questions.length;

    return (answered / total) * 100;
  }

  getAnsweredCount(): number {
    return this.userAnswers.filter(a => a).length;
  }
  closeResult(){
  this.quizSubmitted = false;
}
  // ==========================
  // SUBJECT ACCESS CHECK
  // ==========================

  canAccessSubject(subject: string) {

    // login check
    if (!this.isLoggedIn) return false

    // class check
    if (this.studentData.standard !== '9th') return false

    // subject check
    return this.studentData.subjects.includes(subject)

  }

}
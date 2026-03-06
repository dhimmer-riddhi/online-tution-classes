import { Component } from '@angular/core';
import { StudFooter } from "../../stud-footer/stud-footer";
import { StudentHeader } from "../../student-header/student-header";
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../../firebase-service/firebase-enum';

@Component({
  selector: 'app-eleventh-commerce',
  imports: [StudFooter, StudentHeader,CommonModule],
  templateUrl: './eleventh-commerce.html',
  styleUrl: './eleventh-commerce.css',
})
export class EleventhCommerce {
handleButtonClick(_t72: any) {
throw new Error('Method not implemented.');
}
  

 // 🔹 SUBJECT TOGGLES – Open Down Videos

openAccountVideos() {
  this.showAccountVideos = true;
  this.showStatsVideos = false;
  this.showEnglishVideos = false;
}

openStatsVideos() {
  this.showStatsVideos = true;
  this.showAccountVideos = false;
  this.showEnglishVideos = false;
}

openEnglishVideos() {
  this.showEnglishVideos = true;
  this.showAccountVideos = false;
  this.showStatsVideos = false;
}

// subject section


cards:any[] = [];

currentCard = 1;

constructor(private firebaseService: FirebaseService) {}

ngOnInit(){

this.firebaseService
.getCollection(FirebaseCollections.Courses)
.subscribe((data:any)=>{

this.cards = data;

});

}

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




  showAccountVideos = false;
showStatsVideos = false;
showEnglishVideos = false;

showVideo = false;
selectedVideo: any = null;

  // 🔹 MATHEMATICS VIDEOS (8 hoy to 8 mukjo)
  accountVideos = [
  {
    title: 'Introduction to Accounting',
    desc: 'Basic concepts and objectives of accounting explained clearly.',
    duration: '20 Minutes',
    date: { day: '05', month: 'Oct, 2025' },
    thumb: 'assets/images/account-video1.jpg',
    videoUrl: 'assets/videos/account1.mp4'
  },
  {
    title: 'Journal Entries – Step by Step',
    desc: 'Learn how to record transactions in journal properly.',
    duration: '25 Minutes',
    date: { day: '07', month: 'Oct, 2025' },
    thumb: 'assets/images/account-video2.jpg',
    videoUrl: 'assets/videos/account2.mp4'
  }
];
statsVideos = [
  {
    title: 'Introduction to Statistics',
    desc: 'Understand meaning, scope and importance of statistics.',
    duration: '18 Minutes',
    date: { day: '06', month: 'Oct, 2025' },
    thumb: 'assets/images/stats-video1.jpg',
    videoUrl: 'assets/videos/stats1.mp4'
  },
  {
    title: 'Collection of Data',
    desc: 'Primary and secondary data collection methods explained.',
    duration: '22 Minutes',
    date: { day: '09', month: 'Oct, 2025' },
    thumb: 'assets/images/stats-video2.jpg',
    videoUrl: 'assets/videos/stats2.mp4'
  }
];

englishVideos = [
  {
    title: 'Prose – Explanation & Summary',
    desc: 'Detailed explanation of prose chapter with examples.',
    duration: '21 Minutes',
    date: { day: '04', month: 'Oct, 2025' },
    thumb: 'assets/images/english-video1.jpg',
    videoUrl: 'assets/videos/english1.mp4'
  },
  {
    title: 'Grammar – Tenses Made Easy',
    desc: 'Understand all types of tenses with simple rules.',
    duration: '23 Minutes',
    date: { day: '10', month: 'Oct, 2025' },
    thumb: 'assets/images/english-video2.jpg',
    videoUrl: 'assets/videos/english2.mp4'
  }
];

  openVideo(video: any) {
    this.selectedVideo = video;
    this.showVideo = true;
  }

  closeVideo() {
    this.showVideo = false;
    this.selectedVideo = null;
  }

  
}

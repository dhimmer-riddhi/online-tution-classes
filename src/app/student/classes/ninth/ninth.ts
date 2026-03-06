import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { StudentHeader } from "../../student-header/student-header";
import { StudFooter } from "../../stud-footer/stud-footer";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ninth',
  imports: [StudentHeader, StudFooter,CommonModule],
  templateUrl: './ninth.html',
  styleUrl: './ninth.css',
})
export class Ninth {
 

  // 🔹 SUBJECT TOGGLES open down vedios
  openMathVideos() {
  this.showMathVideos = true;
  this.showScienceVideos = false;
  this.showEnglishVideos = false;
}

openScienceVideos() {
  this.showScienceVideos = true;
  this.showMathVideos = false;
  this.showEnglishVideos = false;
}

openEnglishVideos() {
  this.showEnglishVideos = true;
  this.showMathVideos = false;
  this.showScienceVideos = false;
}

// subject scetion card swipe

currentCard = 1;

  cards = [
  {
    title: 'Mathematics - Class 9',
    description: 'Concept Based Learning for Strong Foundation',
    fees: '₹1500 / Month',
    duration: '4 Months',
    mode: 'Online Video Based',
    teacher: {
      name: 'Prof. Rajesh Mehta',
      profile: 'assets/images/profile1.jpg',
      details: 'M.Sc Mathematics | 12+ Years Experience',
      bio: 'Expert in conceptual mathematics with a focus on board exam preparation.'
    },
    chapters: ['Number Systems', 'Polynomials', 'Linear Equations', 'Triangles', 'Statistics'],
    buttons: [
      { text: 'Enroll Now', type: 'primary' },
      { text: 'View Videos', type: 'outline', action: 'openMathVideos' }
    ]
  },
  {
    title: 'Science - Class 9',
    description: 'Conceptual Learning in Physics, Chemistry & Biology',
    fees: '₹1700 / Month',
    duration: '4 Months',
    teacher: {
      name: 'Dr. Neha Shah',
      profile: 'assets/images/teacher-science.jpg',
      details: 'M.Sc. (Physics) | 8+ Years Experience',
      bio: 'Expert in simplifying complex scientific concepts with practical experiments.'
    },
    chapters: ['Motion', 'Atoms & Molecules', 'Cell Structure', 'Force & Laws of Motion', 'Gravitation'],
    buttons: [
      { text: 'Enroll Now', type: 'light-btn' },
      { text: 'View Videos', type: 'outline', action: 'openScienceVideos' }
    ]
  },
  {
    title: 'English - Class 9',
    description: 'Improve grammar, vocabulary & communication skills',
    fees: '₹1300 / Month',
    duration: '4 Months',
    mode: 'Offline + Online',
    teacher: {
      name: 'Ms. Priya Desai',
      profile: 'assets/images/teacher3.jpg',
      details: 'M.A English | 6+ Years Experience',
      bio: 'Expert in grammar, literature, and spoken English training.'
    },
    chapters: ['Beehive & Moments', 'Grammar & Tenses', 'Writing Skills', 'Reading Comprehension', 'Vocabulary Development'],
    buttons: [
      { text: 'Enroll Now', type: 'light-btn' },
      { text: 'View Videos', type: 'outline', action: 'openEnglishVideos' }
    ]
  }
];

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
handleButtonClick(btn: any) {
  if (btn.action) {
    switch (btn.action) {
      case 'openMathVideos':
        this.openMathVideos();
        break;
      case 'openScienceVideos':
        this.openScienceVideos();
        break;
      case 'openEnglishVideos':
        this.openEnglishVideos();
        break;
    }
  } else {
    console.log(btn.text + " clicked!");
  }
}


  showMathVideos = false;
  showScienceVideos = false;
  showEnglishVideos = false;

  showVideo = false;
  selectedVideo: any = null;

  // 🔹 MATHEMATICS VIDEOS (8 hoy to 8 mukjo)
  mathVideos = [
    {
      title: 'Number Systems – Introduction',
      desc: 'Basics of number systems with simple examples.',
      duration: '18 Minutes',
      date: { day: '04', month: 'Oct, 2025' },
      thumb: 'assets/images/math-video1.jpg',
      videoUrl: 'assets/videos/math1.mp4'
    },
    {
      title: 'Polynomials – Core Concepts',
      desc: 'Understand polynomials step by step.',
      duration: '22 Minutes',
      date: { day: '06', month: 'Oct, 2025' },
      thumb: 'home-third2-sec.jpg',
      videoUrl: '9th-demo vedio.mp4'
    }
  ];
// 🔹 Science VIDEOS (8 hoy to 8 mukjo)
   scienceVideos = [
  {
    title: 'Cell Structure – Introduction',
    desc: 'Learn about cell structure and its basic components.',
    duration: '20 Minutes',
    date: { day: '05', month: 'Oct, 2025' },
    thumb: 'assets/images/science-video1.jpg',
    videoUrl: 'assets/videos/science1.mp4'
  },
  {
    title: 'Motion – Basic Concepts',
    desc: 'Understand types of motion with simple real-life examples.',
    duration: '24 Minutes',
    date: { day: '08', month: 'Oct, 2025' },
    thumb: 'assets/images/science-video2.jpg',
    videoUrl: 'assets/videos/science2.mp4'
  },
 
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

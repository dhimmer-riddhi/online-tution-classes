import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudentHeader } from "../student-header/student-header";
import { StudFooter } from "../stud-footer/stud-footer";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [StudentHeader, StudFooter,CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
 showVideo = false;

  @ViewChild('videoPlayer') videoPlayer!: ElementRef;

  openVideo() {
    this.showVideo = true;
  }

  closeVideo() {
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.pause();
      this.videoPlayer.nativeElement.currentTime = 0;
    }
    this.showVideo = false;
  }

  // third section 

  activeIndex: number | null = null;

  faqs = [
    {
      question: "What are the benefits of online tuition for school students?",
      answer: "Online tuition offers flexibility, personalized learning, and access to experienced tutors from anywhere."
    },
    {
      question: "How does online tuition work?",
      answer: "Students attend live classes through video platforms where tutors explain concepts and solve doubts in real time."
    },
    {
      question: "What subjects can I study through online tuition?",
      answer: "Students can study subjects like Mathematics, Science, English, Social Studies, and more."
    },
    {
      question: "How do I sign up for a demo class?",
      answer: "You can sign up for a demo class by filling the demo form on our website."
    },
    {
      question: "Can I access online tuition classes on a tablet or mobile phone?",
      answer: "Yes, classes can be accessed through mobile phones, tablets, laptops, or desktops."
    },
    {
      question: "How can online tuition help students prepare for exams?",
      answer: "Tutors provide exam-focused preparation, practice tests, and doubt solving sessions."
    }
  ];

  toggleFAQ(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
}

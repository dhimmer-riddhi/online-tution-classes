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

  studentData:any = null
  isLoggedIn = false

  currentCard = 1;

  showVideo = false;
  selectedVideo: any = null;

  constructor(private firebaseService: FirebaseService) {}

ngOnInit(){

const student = localStorage.getItem('student')

if(student){
this.studentData = JSON.parse(student)
this.isLoggedIn = true
}

this.firebaseService
.getCollection(FirebaseCollections.Courses)
.subscribe((data:any)=>{

this.cards = data.filter((course:any)=>{

return course.class === '9th'

})

})

}

  // ==========================
  // CARD SLIDER
  // ==========================

  nextCard(){

    if(this.currentCard < this.cards.length){
      this.currentCard++;
    }

  }

  prevCard(){

    if(this.currentCard > 1){
      this.currentCard--;
    }

  }

  // ==========================
  // FETCH VIDEOS
  // ==========================

 getVideosBySubject(subject:string){

this.firebaseService
.getCollection(FirebaseCollections.ClassContent)
.subscribe((data:any)=>{

let videos:any[] = [];

data.forEach((doc:any)=>{

const item = doc.data ? doc.data : doc;

if(
item.standard === '9th' &&
item.subjectName === subject &&
item.video
){

const video = item.video;

videos.push({
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

setTimeout(()=>{
document.querySelector('.event-section')?.scrollIntoView({behavior:'smooth'});
},100);

});

}

  // ==========================
  // VIDEO MODAL
  // ==========================

  openVideo(video:any){

    this.selectedVideo = video;
    this.showVideo = true;

  }

  closeVideo(){

    this.showVideo = false;
    this.selectedVideo = null;

  }

  // ==========================
// SUBJECT ACCESS CHECK
// ==========================

canAccessSubject(subject:string){

// login check
if(!this.isLoggedIn) return false

// class check
if(this.studentData.standard !== '9th') return false

// subject check
return this.studentData.subjects.includes(subject)

}

}
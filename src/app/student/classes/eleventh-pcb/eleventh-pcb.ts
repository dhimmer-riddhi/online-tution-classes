import { Component } from '@angular/core';
import { StudentHeader } from "../../student-header/student-header";
import { StudFooter } from "../../stud-footer/stud-footer";
import { FirebaseCollections } from '../../../firebase-service/firebase-enum';
import { FirebaseService } from '../../../firebase-service/firebase-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eleventh-pcb',
  imports: [StudentHeader, StudFooter,CommonModule],
  templateUrl: './eleventh-pcb.html',
  styleUrl: './eleventh-pcb.css',
})
export class EleventhPcb {
         cards: any[] = [];
  videos: any[] = [];

  studentData: any = null;
  isLoggedIn = false;

  currentCard = 1;

  showVideo = false;
  selectedVideo: any = null;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(){

    const student = localStorage.getItem('student');

    if(student){
      this.studentData = JSON.parse(student);
      this.isLoggedIn = true;
    }

    // 🔥 Fetch Courses
    this.firebaseService
    .getCollection(FirebaseCollections.Courses)
    .subscribe((data:any)=>{

      this.cards = data.filter((course:any)=>{

        return course.class === '11th'
        && course.stream === 'PCB'

      })

    })

  }

  // ======================
  // CARD SLIDER
  // ======================

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

  // ======================
  // FETCH VIDEOS
  // ======================

  getVideosBySubject(subject:string){

    this.firebaseService
    .getCollection(FirebaseCollections.ClassContent)
    .subscribe((data:any)=>{

      let videos:any[] = [];

      data.forEach((doc:any)=>{

        const item = doc.data ? doc.data : doc;

        if(
          item.standard === '11th' &&
          item.stream === 'PCB' &&
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
        document.querySelector('.event-section')
        ?.scrollIntoView({behavior:'smooth'});
      },100);

    });

  }

  // ======================
  // VIDEO MODAL
  // ======================

  openVideo(video:any){
    this.selectedVideo = video;
    this.showVideo = true;
  }

  closeVideo(){
    this.showVideo = false;
    this.selectedVideo = null;
  }

  // ======================
  // SUBJECT ACCESS CHECK
  // ======================

  canAccessSubject(subject:string){

    if(!this.isLoggedIn) return false;

    if(this.studentData.standard !== '11th') return false;

    if(this.studentData.stream !== 'Science') return false;

    if(this.studentData.scienceGroup !== 'PCB') return false;

    return this.studentData.subjects.includes(subject);

  }


}

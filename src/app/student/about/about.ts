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

}

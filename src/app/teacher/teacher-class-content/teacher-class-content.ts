import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { TeacherHeader } from "../teacher-header/teacher-header";

// CKEditor Imports
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-teacher-class-content',
  standalone: true,
  imports: [CommonModule, FormsModule, TeacherHeader, CKEditorModule], // CKEditorModule added
  templateUrl: './teacher-class-content.html',
  styleUrls: ['./teacher-class-content.css']
})
export class TeacherClassContent implements OnInit {
  public Editor = ClassicEditor; // Editor Instance

  selectedStandard: string | null = null;
  selectedCategory: string | null = null;
  selectedSubject: any = null;

  standards = ['9th', '10th', '11th', '12th'];
  categories: string[] = [];
  subjects: any[] = [];

  video: any = {
    title: '',
    description: '', // This will hold Rich Text data
    date: '',
    time: '',
    url: '',
    fileName: '',
    image: ''
  };

  videoAccept = '.mp4,.avi,.mkv,.mov,.wmv,.flv,.webm';

  constructor(private firebaseService: FirebaseService, private ngZone: NgZone) {}

  ngOnInit() {}

  openSubject(subject: any) { this.selectedSubject = subject; }
  backToSubjects() { this.selectedSubject = null; }

  selectStandard(std: string) {
    this.selectedStandard = std;
    this.selectedCategory = null;
    this.selectedSubject = null;
    this.categories = [];
    if (std === '10th') this.categories = ['GSEB', 'CBSE'];
    else if (std === '11th' || std === '12th') this.categories = ['Commerce', 'PCM', 'PCB'];
    this.loadSubjects();
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
    this.selectedSubject = null;
    this.loadSubjects();
  }

  loadSubjects() {
    this.firebaseService.getCollection(FirebaseCollections.Courses).subscribe((data: any[]) => {
      let filtered = data;
      if (this.selectedStandard) filtered = filtered.filter(d => d.class == this.selectedStandard);
      if (this.selectedCategory) {
        filtered = filtered.filter(d => d.board == this.selectedCategory || d.stream == this.selectedCategory);
      }
      this.subjects = filtered;
    });
  }

  onVideoUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Tution_videos');
    fetch('https://api.cloudinary.com/v1_1/dovmj5mds/upload', { method: 'POST', body: formData })
      .then(res => res.json())
      .then(data => {
        this.ngZone.run(() => {
          this.video.url = data.secure_url;
          this.video.fileName = file.name;
          alert("Video Uploaded");
        });
      });
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Image = reader.result;
      const formData = new FormData();
      formData.append('file', base64Image as string);
      formData.append('upload_preset', 'Tution_videos');
      fetch('https://api.cloudinary.com/v1_1/dovmj5mds/image/upload', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          this.ngZone.run(() => {
            this.video.image = data.secure_url;
            alert("Image Uploaded");
          });
        });
    };
  }

  async saveVideo() {
    if (!this.selectedStandard || !this.selectedSubject) { alert("Select Subject"); return; }
    if (!this.video.date) { alert("Select Date"); return; }
    if (!this.video.url) { alert("Upload Video First"); return; }

    const inputDate = new Date(this.video.date);
    const day = inputDate.toLocaleDateString('en-GB', { day: '2-digit' });
    const month = inputDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const duration = this.video.time + ' Minutes';

    const data = {
      standard: this.selectedStandard,
      subjectId: this.selectedSubject.id,
      subjectName: this.selectedSubject.title,
      board: this.selectedSubject.board || null,
      stream: this.selectedSubject.stream || null,
      video: {
        title: this.video.title,
        description: this.video.description, // HTML content from CKEditor
        url: this.video.url,
        fileName: this.video.fileName,
        image: this.video.image,
        time: duration,
        date: { day: day, month: month }
      }
    };

    await this.firebaseService.addDocument(FirebaseCollections.ClassContent, data);
    alert("Video Saved");
    this.video = { title: '', description: '', date: '', time: '', url: '', fileName: '', image: '' };
  }
}
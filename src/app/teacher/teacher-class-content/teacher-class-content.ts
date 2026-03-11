
import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { ClassContent } from '../../interface/class-content';
import { TeacherFooter } from '../teacher-footer/teacher-footer';
import { TeacherHeader } from '../teacher-header/teacher-header';


@Component({
  selector: 'app-teacher-class-content',
  standalone: true,
  imports: [CommonModule, FormsModule,TeacherHeader,TeacherFooter],
  templateUrl: './teacher-class-content.html',
  styleUrls: ['./teacher-class-content.css']
})
export class TeacherClassContent implements OnInit {

  selectedStandard: string | null = null;
  selectedCategory: string | null = null;
  selectedSubject: any = null;

  standards = ['9', '10', '11', '12'];
  categories: string[] = [];
  subjects: any[] = [];

  contents: ClassContent['contents'] = [];

  savedContents: ClassContent[] = [];

  selectedChapterIndex = 0;

  allowedExtensions = ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'mpeg', 'mpg', '3gp', 'asf'];
  videoAccept = '.mp4,.avi,.mkv,.mov,.wmv,.flv,.webm,.mpeg,.mpg,.3gp,.asf';

  constructor(
    private firebaseService: FirebaseService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.loadSavedData();
    this.loadSavedContents();

  }
  loadSavedContents() {

    this.firebaseService
      .getCollection(FirebaseCollections.ClassContent)
      .subscribe((data: any) => {

        // ⭐ newest first
        this.savedContents = data.reverse()

      })

  }
  /* LOAD TABLE DATA */
  loadSavedData() {
    this.firebaseService.getCollection(FirebaseCollections.ClassContent)
      .subscribe((data: any[]) => {
        this.savedContents = data;
      });
  }
  selectStandard(std: string) {

    this.selectedStandard = std;
    this.selectedCategory = null;
    this.selectedSubject = null;
    this.contents = [];
    this.categories = [];

    if (std === '10') this.categories = ['GSEB', 'CBSE'];
    else if (std === '11' || std === '12') this.categories = ['Commerce', 'PCM', 'PCB'];

    this.loadSubjects();
  }

  selectCategory(cat: string) {

    this.selectedCategory = cat;
    this.selectedSubject = null;
    this.contents = [];
    this.loadSubjects();

  }

  loadSubjects() {

    this.firebaseService.getCollection(FirebaseCollections.Standard)
      .subscribe((data: any[]) => {

        let filtered = data.filter(d => d.standard === this.selectedStandard);

        if (this.selectedCategory)
          filtered = filtered.filter(d => d.category === this.selectedCategory);

        this.subjects = filtered;

      });

  }

  openSubject(subject: any) {

    this.selectedSubject = subject;

    this.firebaseService.getDocument<ClassContent>(FirebaseCollections.ClassContent, subject.id)
      .subscribe(doc => {

        this.ngZone.run(() => {

          this.contents = doc?.contents || [];

          // ===== ADD THIS =====
          if (this.contents.length > 0) {
            this.selectedChapterIndex = this.contents.length - 1;
          } else {
            this.selectedChapterIndex = 0;
          }

        });

      });

  }

  backToSubjects() {

    this.selectedSubject = null;
    this.contents = [];

  }
  addChapter() {

    const newChapter = {
      chapterNo: this.contents.length + 1,
      chapterName: '',
      concepts: []
    }

    this.contents.push(newChapter)

    // ⭐ NEW CHAPTER AUTO OPEN
    this.selectedChapterIndex = this.contents.length - 1

  }
  deleteChapter(index: number) {
    if (confirm('Delete this chapter?')) {
      this.contents.splice(index, 1);
      this.contents.forEach((c, i) => c.chapterNo = i + 1);
    }
  }
  addConcept(chapter: any) {

    chapter.concepts.push({
      title: '',
      contents: []
    });

  }
  deleteConcept(chapter: any, index: number) {

    if (confirm('Delete concept?'))
      chapter.concepts.splice(index, 1);

  }

  addContent(concept: any) {

    concept.contents.push({
      contentTitle: '',
      contentDefinition: '',
      videos: []
    });

  }

  deleteContent(concept: any, index: number) {

    if (confirm('Delete content?'))
      concept.contents.splice(index, 1);

  }

  onVideoUpload(event: any, content: any) {

    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Tution_videos');

    fetch('https://api.cloudinary.com/v1_1/dovmj5mds/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {

        this.ngZone.run(() => {

          if (!content.videos) content.videos = [];

          content.videos.push({
            url: data.secure_url,
            duration: 0,
            fileName: file.name
          });

          alert("Video Uploaded");

        });

      });

  }

  deleteVideo(content: any, index: number) {

    if (confirm('Delete video?'))
      content.videos.splice(index, 1);

  }

  async saveContent() {

    if (!this.selectedStandard || !this.selectedSubject) {

      alert("Select Standard & Subject");
      return;

    }

    const data: ClassContent = {

      standard: this.selectedStandard,
      subjectId: this.selectedSubject.id,
      subjectName: this.selectedSubject.subject,
      contents: this.contents

    };

    if (this.selectedCategory)
      (data as any).category = this.selectedCategory;

    try {

      await this.firebaseService.updateDocument(
        FirebaseCollections.ClassContent,
        this.selectedSubject.id,
        data
      );

      alert('Content Saved Successfully');

    }
    catch {

      await this.firebaseService.addDocument(
        FirebaseCollections.ClassContent,
        { id: this.selectedSubject.id, ...data }
      );

      alert('Content Saved Successfully');

    }

    // reload table
    this.loadSavedContents();

    // reset form
    this.contents = [];
    this.selectedSubject = null;
    this.selectedChapterIndex = 0;
    this.savedContents.unshift(data);
  }
  editSaved(data: any) {

    this.selectedStandard = data.standard
    this.selectedCategory = data.category || null

    this.selectedSubject = {
      id: data.subjectId,
      subject: data.subjectName
    }

    this.contents = JSON.parse(JSON.stringify(data.contents))

    // ⭐ LAST CHAPTER OPEN
    if (this.contents.length > 0) {
      this.selectedChapterIndex = this.contents.length - 1
    } else {
      this.selectedChapterIndex = 0
    }

  }

  /* DELETE DATA */
  async deleteSaved(index: number, data: any) {

    if (confirm("Delete this data?")) {

      await this.firebaseService.deleteDocument(
        FirebaseCollections.ClassContent,
        data.subjectId
      )

      this.savedContents.splice(index, 1)

    }

  }
}

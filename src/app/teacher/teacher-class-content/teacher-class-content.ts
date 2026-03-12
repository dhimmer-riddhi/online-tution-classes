// src/app/teacher/teacher-class-content/teacher-class-content.ts
import { Component, OnInit, NgZone, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { ClassContent } from '../../interface/class-content';
declare var bootstrap: any;

@Component({
  selector: 'app-teacher-class-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-class-content.html',
  styleUrls: ['./teacher-class-content.css']
})
export class TeacherClassContent implements OnInit, OnDestroy {

  selectedStandard: string | null = null;
  selectedCategory: string | null = null;
  selectedSubject: any = null;

  standards = ['9','10','11','12'];
  categories: string[] = [];
  subjects: any[] = [];
  contents: ClassContent['contents'] = [];

  selectedChapterIndex: number | null = null;
  timer: any;

  allowedExtensions = ['mp4','avi','mkv','mov','wmv','flv','webm','mpeg','mpg','3gp','asf'];
  videoAccept = '.mp4,.avi,.mkv,.mov,.wmv,.flv,.webm,.mpeg,.mpg,.3gp,.asf';

  @ViewChild('saveToast') saveToast!: ElementRef;

  toastMessage = '';
  

  constructor(
    private firebaseService: FirebaseService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.startCountdownTimer();
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  /* ================= STANDARD & CATEGORY ================= */
  selectStandard(std: string): void {
    this.selectedStandard = std;
    this.selectedCategory = null;
    this.selectedSubject = null;
    this.contents = [];
    this.selectedChapterIndex = null;

    if (std === '10') this.categories = ['GSEB','CBSE'];
    else if (std === '11' || std === '12') this.categories = ['Commerce','PCM','PCB'];
    else this.categories = [];

    this.loadSubjects();
  }

  selectCategory(cat: string): void {
    this.selectedCategory = cat;
    this.selectedSubject = null;
    this.contents = [];
    this.selectedChapterIndex = null;
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.firebaseService.getCollection(FirebaseCollections.Standard)
      .subscribe((data: any[]) => {
        let filtered = data.filter(d => d.standard === this.selectedStandard);
        if (this.selectedCategory) filtered = filtered.filter(d => d.category === this.selectedCategory);
        this.subjects = filtered;
      });
  }

  openSubject(subject: any): void {
    this.selectedSubject = subject;

    this.firebaseService.getDocument<ClassContent>(FirebaseCollections.ClassContent, subject.id)
      .subscribe(doc => {
        this.ngZone.run(() => {
          this.contents = doc?.contents || [];
          this.selectedChapterIndex = this.contents.length > 0 ? 0 : null;

          // Initialize editing flags for chapters and contents
          this.contents.forEach(ch => {
            ch.editing = false;
            if (!ch.concepts) ch.concepts = [];
            ch.concepts.forEach(con => {
              if (!con.contents) con.contents = [];
              con.contents.forEach(cont => cont.editing = false);
            });
          });
        });
      });
  }

  backToSubjects(): void {
    this.selectedSubject = null;
    this.contents = [];
    this.selectedChapterIndex = null;
  }

  showToast(message: string) {
    this.toastMessage = message;
    const toast = new bootstrap.Toast(this.saveToast.nativeElement, {
      delay: 3000
    });
    toast.show();
  }
  /* ================= CHAPTER ================= */
  addChapter(): void {
    const chapter = {
      chapterNo: this.contents.length + 1,
      chapterName: '',
      content: '',
      editing: true,
      expanded: true,
      concepts: []
    };
    this.contents.push(chapter);
    this.selectedChapterIndex = this.contents.length - 1;
  }

  toggleChapterEdit(chapter: any): void {
    chapter.editing = !chapter.editing;
  }

  deleteChapter(index: number): void {
    if (confirm('Delete this chapter?')) {
      this.contents.splice(index, 1);
      this.contents.forEach((ch, i) => ch.chapterNo = i + 1);
      if (this.selectedChapterIndex === index) this.selectedChapterIndex = null;
      else if (this.selectedChapterIndex !== null && this.selectedChapterIndex > index) this.selectedChapterIndex--;
    }
  }

  openChapter(index: number): void {
    this.selectedChapterIndex = index;
    this.contents[index].editing = true;
  }

  /* ================= CONCEPT ================= */
  addConcept(chapter: any): void {
    chapter.concepts.push({
      id: undefined,
      title: '',
      definition: '',
      contents: []
    });
  }

  editConcept(concept: any): void { }
  deleteConcept(chapter: any, index: number): void {
    if (confirm('Delete this concept?')) chapter.concepts.splice(index, 1);
  }

  /* ================= CONTENT ================= */
  addContent(concept: any): void {
    concept.contents.push({
      contentTitle: '',
      contentDefinition: '',
      videos: [],
      editing: true
    });
  }

  editContent(content: any): void {
    content.editing = true;
  }

  saveContentBlock(content: any): void {
    content.editing = false;
  }

  deleteContent(concept: any, index: number): void {
    if (confirm('Delete this content?')) concept.contents.splice(index, 1);
  }

  /* ================= VIDEO ================= */
  onVideoUpload(event: any, content: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !this.allowedExtensions.includes(extension)) {
      
      this.showToast('Invalid video format');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Tution_videos');

    fetch('https://api.cloudinary.com/v1_1/dovmj5mds/upload', { method: 'POST', body: formData })
      .then(res => res.json())
      .then(data => {
        this.ngZone.run(() => {
          content.videos = content.videos || [];
          content.videos.push({
            url: data.secure_url,
            duration: 0,
            fileName: file.name
          });
          this.showToast('Video Uploaded Successfully');
        });
      })
      .catch(err => {
        console.error(err);
        
        this.showToast('File Uploaded Failed');
      });
  }

  editVideo(video: any): void {
    console.log('Editing video', video.fileName);
  }

  deleteVideo(content: any, index: number): void {
    if (confirm('Delete this video?')) content.videos.splice(index, 1);
  }

  /* ================= RICH TEXT TOOLBAR ================= */
  applyFormat(chapter: any, tag: string): void {
    const textarea: any = document.getElementById(`chapter-${chapter.chapterNo}`);
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    let formatted = value;

    switch(tag) {
      case 'b': formatted = value.slice(0,start)+'<b>'+value.slice(start,end)+'</b>'+value.slice(end); break;
      case 'i': formatted = value.slice(0,start)+'<i>'+value.slice(start,end)+'</i>'+value.slice(end); break;
      case 'link': const url=prompt('Enter URL'); if(url) formatted=value.slice(0,start)+`<a href="${url}">`+value.slice(start,end)+`</a>`+value.slice(end); break;
      case 'img': const imgUrl=prompt('Enter image URL'); if(imgUrl) formatted=value.slice(0,start)+`<img src="${imgUrl}" alt="Image">`+value.slice(end); break;
      case 'table': formatted=value.slice(0,start)+`<table><tr><td>Cell</td></tr></table>`+value.slice(end); break;
      case 'quote': formatted=value.slice(0,start)+`<blockquote>`+value.slice(start,end)+`</blockquote>`+value.slice(end); break;
      case 'video': const vUrl=prompt('Enter video URL'); if(vUrl) formatted=value.slice(0,start)+`<iframe src="${vUrl}" frameborder="0"></iframe>`+value.slice(end); break;
      case 'ul': formatted=value.slice(0,start)+`<ul><li>`+value.slice(start,end)+`</li></ul>`+value.slice(end); break;
      case 'ol': formatted=value.slice(0,start)+`<ol><li>`+value.slice(start,end)+`</li></ol>`+value.slice(end); break;
      case 'undo': alert('Undo not implemented'); return;
    }

    chapter.content = formatted;
    textarea.value = formatted;
  }

  /* ================= SAVE ================= */
  async saveContent(): Promise<void> {
    if (!this.selectedStandard || !this.selectedSubject) {
      
      this.showToast('Select Standard and Subject first');
      return;
    }

    // Clean invalid videos
    this.contents.forEach(ch => {
      ch.concepts.forEach(con => {
        con.contents.forEach(content => {
          content.videos = content.videos?.filter(v => v.url && v.fileName) || [];
        });
      });
    });

    const data: ClassContent = {
      standard: this.selectedStandard,
      subjectId: this.selectedSubject.id,
      subjectName: this.selectedSubject.subject,
      contents: this.contents
    };

    if(this.selectedCategory) (data as any).category = this.selectedCategory;

    try {
      await this.firebaseService.updateDocument(FirebaseCollections.ClassContent, this.selectedSubject.id, data);
      
      this.showToast('Content Saved Successfully');
    } catch {
      await this.firebaseService.addDocument(FirebaseCollections.ClassContent, { id: this.selectedSubject.id, ...data });
      this.showToast('Content Saved Successfully');
    }
  }

  /* ================= COUNTDOWN PLACEHOLDER ================= */
  startCountdownTimer(): void { }
}  
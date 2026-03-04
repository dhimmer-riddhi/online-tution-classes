import { CommonModule } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { ClassContent } from '../../interface/class-content';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { TeacherHeader } from "../teacher-header/teacher-header";

@Component({
  selector: 'app-teacher-class-content',
  imports: [CommonModule, FormsModule, TeacherHeader],
  templateUrl: './teacher-class-content.html',
  styleUrl: './teacher-class-content.css',
})
export class TeacherClassContent implements OnInit{
 selectedStandard: string | null = null;
  selectedCategory: string | null = null;
  selectedSubject: any = null;

  standards = ['9', '10', '11', '12'];
  categories: string[] = [];
  subjects: any[] = [];
  contents: any[] = [];

  allowedExtensions = ['mp4','avi','mkv','mov','wmv','flv','webm','mpeg','mpg','3gp','asf'];
  videoAccept = '.mp4,.avi,.mkv,.mov,.wmv,.flv,.webm,.mpeg,.mpg,.3gp,.asf';

  constructor(private firebaseService: FirebaseService, private ngZone: NgZone) {}

  ngOnInit() {}

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
        if (this.selectedCategory) filtered = filtered.filter(d => d.category === this.selectedCategory);
        this.subjects = filtered;
      });
  }

  openSubject(subject: any) {
    this.selectedSubject = subject;
    this.firebaseService.getDocument<ClassContent>(FirebaseCollections.ClassContent, subject.id)
      .subscribe(doc => this.ngZone.run(() => { this.contents = doc?.contents || []; }));
  }

  backToSubjects() { this.selectedSubject = null; this.contents = []; }

  addChapter() { this.contents.push({ chapterNo: this.contents.length + 1, chapterName: '', expanded: true, concepts: [] }); }
  deleteChapter(index: number) { if(confirm('Delete this chapter?')) { this.contents.splice(index, 1); this.renumberChapters(); } }
  editChapter(chapter: any) { chapter.expanded = true; alert('Chapter editing enabled'); }
  toggleChapter(chapter: any) { chapter.expanded = !chapter.expanded; }
  renumberChapters() { this.contents.forEach((ch,i)=>ch.chapterNo=i+1); }

  addConcept(chapter: any) { chapter.concepts.push({title:'',definition:'',contents:[]}); }
  deleteConcept(chapter: any,index:number){ if(confirm('Delete this concept?')) chapter.concepts.splice(index,1); }
  editConcept(concept:any){ alert('Concept editing enabled'); }

  addContent(concept:any){ concept.contents.push({contentTitle:'',contentDefinition:'',videos:[]}); }
  deleteContent(concept:any,index:number){ if(confirm('Delete this content?')) concept.contents.splice(index,1); }
  editContent(content:any){ alert('Content editing enabled'); }

  // ================= VIDEO UPLOAD (NO PROGRESS) =================
  onVideoUpload(event: any, content: any) {
    const file = event.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !this.allowedExtensions.includes(ext)) {
      alert('Video Upload Failed – Invalid format! Allowed: ' + this.allowedExtensions.join(', '));
      return;
    }

    const minSize = 1 * 1024 * 1024; // 1 MB
    const maxSize = 2 * 1024 * 1024 * 1024; // 2 GB
    if (file.size < minSize) { alert('Video Upload Failed – File too small (min 1 MB)'); return; }
    if (file.size > maxSize) { alert('Video Upload Failed – File too huge (max 2 GB)'); return; }

    const storage = getStorage();
    const path = `videos/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      null,
      error => {
        console.error(error);
        alert('Video Upload Failed – Something went wrong');
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        const videoEl = document.createElement('video');
        videoEl.preload = 'metadata';
        videoEl.onloadedmetadata = () => {
          content.videos.push({
            url: downloadURL,
            duration: Math.floor(videoEl.duration),
            fileName: file.name
          });
          alert('Video Uploaded Successfully');
        };
        videoEl.src = URL.createObjectURL(file);
      }
    );
  }

  deleteVideo(content: any, index: number) { if(confirm('Delete this video?')) content.videos.splice(index,1); }
  editVideo(video: any){ alert('You can re-upload video if needed'); }

  // ================= SAVE CONTENT (CREATE IF NOT EXIST) =================
  async saveContent() {
    if(!this.selectedStandard || !this.selectedSubject){ alert('Select Standard and Subject First'); return; }

    const data: ClassContent = {
      standard: this.selectedStandard,
      subjectId: this.selectedSubject.id,
      subjectName: this.selectedSubject.subject,
      contents: this.contents
    };

    try {
      // Check if document exists
      const docExist = await this.firebaseService.getDocument<ClassContent>(FirebaseCollections.ClassContent, this.selectedSubject.id).toPromise();

      if (docExist) {
        await this.firebaseService.updateDocument(FirebaseCollections.ClassContent, this.selectedSubject.id, data);
      } else {
        await this.firebaseService.addDocument(FirebaseCollections.ClassContent, { id: this.selectedSubject.id, ...data });
      }

      alert('Content Saved Successfully');
    } catch(error){
      console.error(error);
      alert('Error Saving Content');
    }
  }
}

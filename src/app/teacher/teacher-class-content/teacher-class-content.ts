import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { ClassContent } from '../../interface/class-content';

@Component({
  selector: 'app-teacher-class-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-class-content.html',
  styleUrls: ['./teacher-class-content.css']
})
export class TeacherClassContent implements OnInit {

  selectedStandard: string | null = null;
  selectedCategory: string | null = null;
  selectedSubject: {id:string, subject:string, category?:string} | null = null;

  standards = ['9','10','11','12'];
  categories: string[] = [];
  subjects: any[] = [];
  contents: ClassContent['contents'] = [];

  selectedChapterIndex: number = 0;
  allowedExtensions = ['mp4','avi','mkv','mov','wmv','flv','webm','mpeg','mpg','3gp','asf'];
  videoAccept = '.mp4,.avi,.mkv,.mov,.wmv,.flv,.webm,.mpeg,.mpg,.3gp,.asf';

  constructor(private firebaseService: FirebaseService, private ngZone: NgZone) {}

  ngOnInit() {
    const lastSubject = localStorage.getItem('lastSubject');
    if(lastSubject) {
      const sub = JSON.parse(lastSubject);
      if(sub?.id) this.openSubject(sub);
      else localStorage.removeItem('lastSubject');
    }
  }

  selectStandard(std: string) {
    this.selectedStandard = std;
    this.selectedCategory = null;
    this.selectedSubject = null;
    this.contents = [];
    this.categories = std === '10' ? ['GSEB','CBSE'] : (['11','12'].includes(std) ? ['Commerce','PCM','PCB'] : []);
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
        if(this.selectedCategory) filtered = filtered.filter(d => d.category === this.selectedCategory);
        this.subjects = filtered;
      });
  }

  openSubject(subject: {id:string, subject:string, category?:string}) {
    if(!subject?.id) return alert("Invalid Subject!");
    this.selectedSubject = subject;
    localStorage.setItem('lastSubject', JSON.stringify({...subject, standard:this.selectedStandard, category:this.selectedCategory}));

    this.firebaseService.getDocument<ClassContent>(FirebaseCollections.ClassContent, subject.id)
      .subscribe(doc => {
        this.ngZone.run(() => {
          if(doc?.contents) this.contents = doc.contents;
          else this.contents = [{chapterNo:1, chapterName:'', expanded:true, concepts:[]}];
          this.selectedChapterIndex = 0; // First chapter show by default
        });
      }, err => { console.error(err); alert("Error loading content"); });
  }

  backToSubjects() {
    this.selectedSubject = null;
    this.contents = [];
    localStorage.removeItem('lastSubject');
  }

  /** --- Chapter Methods --- */
  addChapter() {
    this.contents.push({chapterNo:this.contents.length+1, chapterName:'', expanded:true, concepts:[]});
    this.selectedChapterIndex = this.contents.length-1;
  }
  editChapter(chapter: any) { chapter.expanded = true; }
  saveChapter(chapter: any) { chapter.expanded = false; }
  deleteChapter(index: number) { 
    if(confirm('Delete Chapter?')) { 
      this.contents.splice(index,1); 
      this.renumberChapters(); 
      if(this.selectedChapterIndex >= this.contents.length) this.selectedChapterIndex = this.contents.length-1;
    } 
  }
  renumberChapters() { this.contents.forEach((ch: any, i:number) => ch.chapterNo=i+1); }

  /** --- Concept Methods --- */
  addConcept(chapter: any) { chapter.concepts.push({title:'', definition:'', example:'', contents:[]}); }
  editConcept(concept: any) { alert(`Edit concept: ${concept.title}`); }
  saveConcept(concept: any) { }
  deleteConcept(chapter: any, index:number) { if(confirm('Delete Concept?')) chapter.concepts.splice(index,1); }

  /** --- Content Methods --- */
  addContent(concept: any) { concept.contents.push({contentTitle:'', contentDefinition:'', videos:[]}); }
  editContent(content: any) { alert(`Edit content: ${content.contentTitle}`); }
  saveContentBlock(content: any) { }
  deleteContent(concept: any, index:number) { if(confirm('Delete Content?')) concept.contents.splice(index,1); }

  /** --- Video Methods --- */
  onVideoUpload(event: Event, content: any) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if(!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if(!ext || !this.allowedExtensions.includes(ext)) return alert("Invalid video format");

    if(!content.videos) content.videos = [];
    const vidObj = {url:'', duration:0, fileName:file.name, uploading:true};
    content.videos.push(vidObj);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Tution_videos');

    fetch('https://api.cloudinary.com/v1_1/dovmj5mds/upload', {method:'POST', body:formData})
      .then(res => res.json())
      .then(data => this.ngZone.run(() => { vidObj.url = data.secure_url; vidObj.uploading=false; }))
      .catch(err => { console.error(err); vidObj.uploading=false; });
  }

  editVideo(video: any) { alert(`Edit video: ${video.fileName}`); }
  onVideoMetadataLoaded(event: Event, vid: any) { const v = event.target as HTMLVideoElement; if(v) vid.duration = Math.floor(v.duration); }
  deleteVideo(content:any,i:number){if(confirm('Delete video?')) content.videos.splice(i,1);}

  /** --- Save All Content --- */
  async saveContent() {
    if(!this.selectedSubject) return alert('Select Subject first');
    this.contents.forEach(ch => ch.concepts?.forEach(con => con.contents?.forEach(c => c.videos = c.videos?.filter(v=>v.url && v.fileName))));
    const data: ClassContent = {
      standard: this.selectedStandard!,
      subjectId: this.selectedSubject.id,
      subjectName: this.selectedSubject.subject,
      contents: this.contents
    };
    if(this.selectedCategory) (data as any).category = this.selectedCategory;
    try { await this.firebaseService.updateDocument(FirebaseCollections.ClassContent,this.selectedSubject.id,data); }
    catch { await this.firebaseService.addDocument(FirebaseCollections.ClassContent,{id:this.selectedSubject.id,...data}); }
    alert("Content saved successfully");
  }
}
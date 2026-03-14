import { Component, OnInit, NgZone, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { TeacherHeader } from "../teacher-header/teacher-header";
declare var bootstrap: any;

// CKEditor Imports
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, TeacherHeader, CKEditorModule],
  templateUrl: './notes.html',
  styleUrls: ['./notes.css']
})
export class Notes implements OnInit {
  public Editor = ClassicEditor;

  selectedStandard: string | null = null;
  selectedCategory: string | null = null;
  selectedSubject: any = null;

  standards = ['9th', '10th', '11th', '12th'];
  categories: string[] = [];
  subjects: any[] = [];

  // Updated variables for Notes
  notes: any = {
    title: '',
    description: '',
    date: '',
    url: '',
    fileName: ''
  };

  @ViewChild('saveToast') saveToast!: ElementRef;
  toastMessage = '';

  constructor(
    private firebaseService: FirebaseService, 
    private ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  openSubject(subject: any) { this.selectedSubject = subject; }
  backToSubjects() { this.selectedSubject = null; }

  showToast(message: string) {
    this.toastMessage = message;
    this.cd.detectChanges();
    setTimeout(() => {
      const toastElement = this.saveToast.nativeElement;
      const existingToast = bootstrap.Toast.getInstance(toastElement);
      if (existingToast) existingToast.dispose();
      const toast = new bootstrap.Toast(toastElement, { delay: 4000, autohide: true });
      toast.show();
    }, 100);
  }

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

  onNotesUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Tution_videos'); // Apne Cloudinary preset ka use karein
    
    // Using 'auto' upload for documents like PDF, DOCX, etc.
    fetch('https://api.cloudinary.com/v1_1/dovmj5mds/auto/upload', { 
      method: 'POST', 
      body: formData 
    })
      .then(res => res.json())
      .then(data => {
        this.ngZone.run(() => {
          this.notes.url = data.secure_url;
          this.notes.fileName = file.name;
          this.showToast('Notes File Uploaded');
        });
      })
      .catch(err => {
        this.showToast('Upload Failed');
        console.error(err);
      });
  }

  async saveNotes() {
    if (!this.selectedStandard || !this.selectedSubject) { this.showToast('Select Subject'); return; }
    if (!this.notes.date) { this.showToast('Select Date'); return; }
    if (!this.notes.url) { this.showToast('Upload Notes File First'); return; }

    const inputDate = new Date(this.notes.date);
    const day = inputDate.toLocaleDateString('en-GB', { day: '2-digit' });
    const month = inputDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    const data = {
      standard: this.selectedStandard,
      subjectId: this.selectedSubject.id,
      subjectName: this.selectedSubject.title,
      board: this.selectedSubject.board || null,
      stream: this.selectedSubject.stream || null,
      notes: {
        title: this.notes.title,
        description: this.notes.description,
        url: this.notes.url,
        fileName: this.notes.fileName,
        date: { day: day, month: month }
      },
      createdAt: new Date().toISOString()
    };

    await this.firebaseService.addDocument(FirebaseCollections.Notes, data);
    this.showToast('Notes Saved Successfully');
    
    // Reset Form
    this.notes = { title: '', description: '', date: '', url: '', fileName: '' };
  }
}
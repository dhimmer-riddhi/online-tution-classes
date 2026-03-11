import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { CommonModule } from '@angular/common';
import { TeacherHeader } from "../teacher-header/teacher-header";
import { TeacherFooter } from '../teacher-footer/teacher-footer';

@Component({
  selector: 'app-teacher-classes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,TeacherHeader,TeacherFooter],
  templateUrl: './teacher-classes.html',
  styleUrl: './teacher-classes.css',
})
export class TeacherClasses  implements OnInit{
selectedStandard: string | null = null;
  categories: string[] = [];
  subjects: any[] = [];

  editMode = false;
  editId: string | null = null;

  courseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private ngZone: NgZone  // ✅ Inject NgZone
  ) {
    this.courseForm = this.fb.group({
      standard: [''],
      category: [''],
      subject: ['', Validators.required] // required only for submission
    });
  }

  ngOnInit() {}

  // ================= SELECT STANDARD =================
  selectStandard(std: string) {
    this.selectedStandard = std;

    // Reset only category & subject input
    this.courseForm.patchValue({
      standard: std,
      category: '',
      subject: ''
    });

    this.editMode = false;
    this.editId = null;

    // Set categories
    if (std === '9') this.categories = [];
    else if (std === '10') this.categories = ['GSEB', 'CBSE'];
    else if (std === '11') this.categories = ['Commerce', 'Science (PCM)', 'Science (PCB)'];
    else if (std === '12') this.categories = ['Commerce', 'Science (PCM)', 'Science (PCB)'];

    // Load all subjects for selected standard immediately
    this.loadSubjects();
  }

  // ================= LOAD SUBJECTS =================
  loadSubjects() {
    if (!this.selectedStandard) return;

    this.firebaseService
      .getCollection(FirebaseCollections.Standard)
      .subscribe((data: any[]) => {
        this.subjects = data
          .filter(d => d.standard === this.selectedStandard)
          .map(d => ({ ...d, id: d.id }));
      });
  }

  // ================= SAVE / UPDATE =================
  submitForm() {
    if (this.courseForm.invalid) return;

    const data = this.courseForm.value;

    if (this.editMode && this.editId) {
      // UPDATE EXISTING
      this.firebaseService.updateDocument(FirebaseCollections.Standard, this.editId, data);
      this.firebaseService.updateDocument(FirebaseCollections.ClassContent, this.editId, data);

      const index = this.subjects.findIndex(s => s.id === this.editId);
      if (index !== -1) {
        this.subjects[index] = { ...data, id: this.editId };
      }

      this.editMode = false;
      this.editId = null;

    } else {
      // ADD NEW SUBJECT
      this.firebaseService.addDocument(FirebaseCollections.Standard, data)
        .then((docRef: any) => {

          // Add to ClassContent
          this.firebaseService.updateDocument(FirebaseCollections.ClassContent, docRef.id, { ...data, contents: [] })
            .catch(() => {
              this.firebaseService.addDocument(FirebaseCollections.ClassContent, { id: docRef.id, ...data, contents: [] });
            });

          // ✅ Push new subject inside Angular zone for immediate UI update
          this.ngZone.run(() => {
            const newSubject = { ...data, id: docRef.id };
            this.subjects = [...this.subjects, newSubject]; // triggers table update immediately
          });

        })
        .catch(err => console.error('Error adding subject:', err));
    }

    // Reset form inputs
    this.courseForm.patchValue({
      subject: '',
      category: ''
    });
  }

  // ================= EDIT =================
  editSubject(sub: any) {
    this.courseForm.patchValue({
      standard: sub.standard,
      category: sub.category,
      subject: sub.subject
    });

    this.editMode = true;
    this.editId = sub.id;
  }

  // ================= DELETE =================
  deleteSubject(sub: any) {
    this.firebaseService.deleteDocument(FirebaseCollections.Standard, sub.id);
    this.firebaseService.deleteDocument(FirebaseCollections.ClassContent, sub.id);

    // Remove from subjects array immediately
    this.subjects = this.subjects.filter(s => s.id !== sub.id);
  }

  // ================= BACK =================
  backToStandards() {
    this.selectedStandard = null;
    this.subjects = [];
    this.editMode = false;
    this.editId = null;
    this.courseForm.reset();
  }
}

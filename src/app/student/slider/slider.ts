import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';


@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './slider.html',
  styleUrl: './slider.css'
})
export class Slider {

courseForm: FormGroup;

showBoard = false;
showStream = false;

teacherImage: any = null;
uploading = false;   // image uploading loader

constructor(
private fb: FormBuilder,
private firebaseService: FirebaseService
) {

this.courseForm = this.fb.group({

class: ['', Validators.required],
board: [''],
stream: [''],

title: ['', Validators.required],
description: ['', Validators.required],
fees: ['', Validators.required],
duration: ['', Validators.required],
mode: ['', Validators.required],

teacher: this.fb.group({

name: ['', Validators.required],
profile: ['', Validators.required],
details: ['', Validators.required],
bio: ['', Validators.required]

}),

chapters: this.fb.array([
this.fb.control('', Validators.required)
])

});
}

get chapters() {
return this.courseForm.get('chapters') as FormArray;
}

addChapter() {
this.chapters.push(this.fb.control('', Validators.required));
}

onClassChange() {

const selectedClass = this.courseForm.get('class')?.value;

this.showBoard = false;
this.showStream = false;

this.courseForm.get('board')?.clearValidators();
this.courseForm.get('stream')?.clearValidators();

if (selectedClass == '10') {
this.showBoard = true;
this.courseForm.get('board')?.setValidators(Validators.required);
}

if (selectedClass == '11' || selectedClass == '12') {
this.showStream = true;
this.courseForm.get('stream')?.setValidators(Validators.required);
}

this.courseForm.get('board')?.updateValueAndValidity();
this.courseForm.get('stream')?.updateValueAndValidity();

}

// upload image section
uploadTeacherImage(event: any) {

  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {

    const base64 = reader.result;

    this.teacherImage = base64;

    this.courseForm.patchValue({
      teacher: {
        ...this.courseForm.value.teacher,
        profile: base64
      }
    });

  };

  reader.readAsDataURL(file);
}


// SAVE COURSE

async submit() {

console.log(this.courseForm.value);

if (this.courseForm.invalid) {

this.courseForm.markAllAsTouched();

alert("Please fill all required fields");

return;

}

const formData = this.courseForm.value;

try {

await this.firebaseService.addDocument(
FirebaseCollections.Courses,
formData
);

alert('Course Added Successfully');

this.courseForm.reset();
this.teacherImage = null;
this.showBoard = false;
this.showStream = false;

} catch (error) {

console.error(error);
alert("Error saving course");

}

}

}
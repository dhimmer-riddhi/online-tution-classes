import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { FirebaseService } from '../../firebase-service/firebase-service';
import { FirebaseCollections } from '../../firebase-service/firebase-enum';
import { Assignment } from '../../interface/teacher-assignment';
import { TeacherFooter } from '../teacher-footer/teacher-footer';

@Component({
selector: 'app-teacher-assignment',
standalone: true,
imports: [CommonModule, FormsModule],
templateUrl: './teacher-assignment.html',
styleUrls: ['./teacher-assignment.css']
})

export class TeacherAssignment implements OnInit {

selectedStandard:string | null=null;
selectedCategory:string | null=null;
selectedSubject:any=null;

standards=['9','10','11','12'];

categories:string[]=[];

subjects:any[]=[];
chapters:any[]=[];

teacherSubjects:string[]=[];

constructor(
private firebaseService:FirebaseService,
private router:Router
){}

ngOnInit(){

const teacherId=sessionStorage.getItem('teacherId');
const password=sessionStorage.getItem('teacherPassword');

if(!teacherId || !password){

this.router.navigate(['/teacher/login']);
return;

}

this.loadTeacher(teacherId,password);

}

loadTeacher(teacherId:string,password:string){

this.firebaseService
.getCollection(FirebaseCollections.Teachers)
.subscribe((teachers:any[])=>{

const teacher=teachers.find((t:any)=>
t.teacherId==teacherId && t.password===password
);

if(teacher){

this.teacherSubjects = teacher.subjects
.split(',')
.map((s:string)=>s.trim().toLowerCase());

}

});

}

selectStandard(std:string){

this.selectedStandard=std;
this.selectedCategory=null;
this.selectedSubject=null;
this.chapters=[];

if(std==='9') this.categories=[];
if(std==='10') this.categories=['GSEB','CBSE'];
if(std==='11'||std==='12') this.categories=['Commerce','PCM','PCB'];

this.loadSubjects();

}

selectCategory(cat:string){

this.selectedCategory=cat;
this.selectedSubject=null;
this.chapters=[];

this.loadSubjects();

}

loadSubjects(){

this.firebaseService
.getCollection(FirebaseCollections.Standard)
.subscribe((data:any[])=>{

let filtered:any[]=[];

if(this.selectedStandard==='9'){

filtered=data.filter((d:any)=>
d.standard==='9'
);

}else{

filtered=data.filter((d:any)=>
d.standard===this.selectedStandard &&
d.category===this.selectedCategory
);

}

filtered=filtered.filter((s:any)=>
this.teacherSubjects.includes(
s.subject.toLowerCase()
)
);

this.subjects=filtered;

});

}

openSubject(subject:any){

this.selectedSubject=subject;

this.firebaseService
.getCollection(FirebaseCollections.TeacherAssignment)
.subscribe((data:any[])=>{

const assignment=data.find((a:any)=>
a.subjectId===subject.id
);

if(assignment){

this.chapters=assignment.chapters;

}else{

this.chapters=[];

}

});

}

back(){

this.selectedSubject=null;
this.chapters=[];

}

addChapter(){

this.chapters.push({

chapterNo:this.chapters.length+1,
chapterName:'',
assignments:[]

});

}

deleteChapter(i:number){

this.chapters.splice(i,1);

}

addAssignment(ch:any){

ch.assignments.push({

title:'',
dueDate:'',
totalMarks:'',
files:[]

});

}

deleteAssignment(ch:any,i:number){

ch.assignments.splice(i,1);

}

async saveAssignment(){

if(!this.selectedSubject) return;

const data:Assignment={

standard:this.selectedStandard!,
category:this.selectedCategory || '',
subjectId:this.selectedSubject.id,
subjectName:this.selectedSubject.subject,
chapters:this.chapters

};

await this.firebaseService.updateDocument(

FirebaseCollections.TeacherAssignment,
this.selectedSubject.id,
data

);

alert('Assignment Saved');

}

}
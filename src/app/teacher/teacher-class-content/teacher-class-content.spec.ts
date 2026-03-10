import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherClassContent } from './teacher-class-content';

describe('TeacherClassContent', () => {
  let component: TeacherClassContent;
  let fixture: ComponentFixture<TeacherClassContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherClassContent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherClassContent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

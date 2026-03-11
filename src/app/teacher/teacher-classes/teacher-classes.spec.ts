import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherClasses } from './teacher-classes';

describe('TeacherClasses', () => {
  let component: TeacherClasses;
  let fixture: ComponentFixture<TeacherClasses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherClasses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherClasses);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

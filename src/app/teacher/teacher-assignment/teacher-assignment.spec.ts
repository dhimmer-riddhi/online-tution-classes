import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAssignment } from './teacher-assignment';

describe('TeacherAssignment', () => {
  let component: TeacherAssignment;
  let fixture: ComponentFixture<TeacherAssignment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherAssignment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherAssignment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherRegistarion } from './teacher-registarion';

describe('TeacherRegistarion', () => {
  let component: TeacherRegistarion;
  let fixture: ComponentFixture<TeacherRegistarion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherRegistarion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherRegistarion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

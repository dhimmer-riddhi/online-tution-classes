import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherFooter } from './teacher-footer';

describe('TeacherFooter', () => {
  let component: TeacherFooter;
  let fixture: ComponentFixture<TeacherFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

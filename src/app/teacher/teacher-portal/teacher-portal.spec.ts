import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherPortal } from './teacher-portal';

describe('TeacherPortal', () => {
  let component: TeacherPortal;
  let fixture: ComponentFixture<TeacherPortal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherPortal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherPortal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

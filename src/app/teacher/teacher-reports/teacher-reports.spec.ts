import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherReports } from './teacher-reports';

describe('TeacherReports', () => {
  let component: TeacherReports;
  let fixture: ComponentFixture<TeacherReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherReports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

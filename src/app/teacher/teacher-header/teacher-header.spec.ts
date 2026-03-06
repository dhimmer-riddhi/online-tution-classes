import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherHeader } from './teacher-header';

describe('TeacherHeader', () => {
  let component: TeacherHeader;
  let fixture: ComponentFixture<TeacherHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

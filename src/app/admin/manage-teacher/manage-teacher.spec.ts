import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTeacher } from './manage-teacher';

describe('ManageTeacher', () => {
  let component: ManageTeacher;
  let fixture: ComponentFixture<ManageTeacher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTeacher]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageTeacher);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

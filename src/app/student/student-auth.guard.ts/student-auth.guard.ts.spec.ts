import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAuthGuardTs } from './student-auth.guard.ts';

describe('StudentAuthGuardTs', () => {
  let component: StudentAuthGuardTs;
  let fixture: ComponentFixture<StudentAuthGuardTs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentAuthGuardTs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentAuthGuardTs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

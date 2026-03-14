import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudDashboard } from './stud-dashboard';

describe('StudDashboard', () => {
  let component: StudDashboard;
  let fixture: ComponentFixture<StudDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

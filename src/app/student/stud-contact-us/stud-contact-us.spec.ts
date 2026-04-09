import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudContactUs } from './stud-contact-us';

describe('StudContactUs', () => {
  let component: StudContactUs;
  let fixture: ComponentFixture<StudContactUs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudContactUs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudContactUs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

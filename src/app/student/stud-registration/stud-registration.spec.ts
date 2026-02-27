import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudRegistration } from './stud-registration';

describe('StudRegistration', () => {
  let component: StudRegistration;
  let fixture: ComponentFixture<StudRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudRegistration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudRegistration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

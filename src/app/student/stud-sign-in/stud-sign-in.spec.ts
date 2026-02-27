import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudSignIn } from './stud-sign-in';

describe('StudSignIn', () => {
  let component: StudSignIn;
  let fixture: ComponentFixture<StudSignIn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudSignIn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudSignIn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

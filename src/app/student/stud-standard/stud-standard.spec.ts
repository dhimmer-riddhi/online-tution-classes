import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudStandard } from './stud-standard';

describe('StudStandard', () => {
  let component: StudStandard;
  let fixture: ComponentFixture<StudStandard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudStandard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudStandard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

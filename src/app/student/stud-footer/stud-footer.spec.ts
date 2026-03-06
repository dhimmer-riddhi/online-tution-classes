import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudFooter } from './stud-footer';

describe('StudFooter', () => {
  let component: StudFooter;
  let fixture: ComponentFixture<StudFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

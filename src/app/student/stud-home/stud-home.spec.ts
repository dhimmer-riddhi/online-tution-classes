import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudHome } from './stud-home';

describe('StudHome', () => {
  let component: StudHome;
  let fixture: ComponentFixture<StudHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

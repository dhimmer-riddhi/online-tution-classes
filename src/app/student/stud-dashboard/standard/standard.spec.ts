import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Standard } from './standard';

describe('Standard', () => {
  let component: Standard;
  let fixture: ComponentFixture<Standard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Standard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Standard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

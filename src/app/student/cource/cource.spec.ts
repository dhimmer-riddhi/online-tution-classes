import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cource } from './cource';

describe('Cource', () => {
  let component: Cource;
  let fixture: ComponentFixture<Cource>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cource]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cource);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

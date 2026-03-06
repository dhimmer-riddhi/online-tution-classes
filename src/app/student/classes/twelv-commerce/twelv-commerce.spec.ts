import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwelvCommerce } from './twelv-commerce';

describe('TwelvCommerce', () => {
  let component: TwelvCommerce;
  let fixture: ComponentFixture<TwelvCommerce>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwelvCommerce]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwelvCommerce);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

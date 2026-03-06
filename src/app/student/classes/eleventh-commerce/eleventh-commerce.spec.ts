import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EleventhCommerce } from './eleventh-commerce';

describe('EleventhCommerce', () => {
  let component: EleventhCommerce;
  let fixture: ComponentFixture<EleventhCommerce>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EleventhCommerce]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EleventhCommerce);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

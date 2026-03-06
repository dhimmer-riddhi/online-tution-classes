import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwelvPcm } from './twelv-pcm';

describe('TwelvPcm', () => {
  let component: TwelvPcm;
  let fixture: ComponentFixture<TwelvPcm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwelvPcm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwelvPcm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

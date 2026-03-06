import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EleventhPcm } from './eleventh-pcm';

describe('EleventhPcm', () => {
  let component: EleventhPcm;
  let fixture: ComponentFixture<EleventhPcm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EleventhPcm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EleventhPcm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

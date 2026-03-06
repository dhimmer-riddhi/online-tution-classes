import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EleventhPcb } from './eleventh-pcb';

describe('EleventhPcb', () => {
  let component: EleventhPcb;
  let fixture: ComponentFixture<EleventhPcb>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EleventhPcb]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EleventhPcb);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

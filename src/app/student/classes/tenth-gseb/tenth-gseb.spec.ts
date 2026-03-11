import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenthGseb } from './tenth-gseb';

describe('TenthGseb', () => {
  let component: TenthGseb;
  let fixture: ComponentFixture<TenthGseb>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenthGseb]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenthGseb);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

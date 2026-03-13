import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenthCbse } from './tenth-cbse';

describe('TenthCbse', () => {
  let component: TenthCbse;
  let fixture: ComponentFixture<TenthCbse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenthCbse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenthCbse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

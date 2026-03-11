import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageApplication } from './manage-application';

describe('ManageApplication', () => {
  let component: ManageApplication;
  let fixture: ComponentFixture<ManageApplication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageApplication]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageApplication);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
